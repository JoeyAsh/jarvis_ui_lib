/**
 * React integration for the JARVIS Web Audio Engine.
 * Copy of src/lib/audio/useAudioEngine.ts — original remains in place.
 * Imports adjusted for new location within core/audio/.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getAudioEngine } from './audioEngine';
import type { AudioEngine } from './audioEngine';
import type { SfxEvent } from './config';
import type { AppOrbState } from '@common/types';
import type { UseAudioEngineOptions } from './useAudioEngine.types';

const STORAGE_KEY = 'jarvis.sfx.muted';
const IDLE_TIMEOUT_MS = 30_000;
const DISCONNECT_SFX_GATE_MS = 5_000;
const OFFLINE_DELAY_MS = 3_000;
const WAKE_GUARD_MS = 500;

/** Stored mute preference, or null when the user never toggled (or storage is unavailable). */
function readStoredMute(): boolean | null {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return value === null ? null : value === 'true';
    } catch {
        return null;
    }
}

function writeStoredMute(value: boolean): void {
    try {
        localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
        // Storage might be full or blocked — degrade silently.
    }
}

export interface UseAudioEngineReturn {
    isMuted: boolean;
    toggleMute: () => void;
    playOneShot: (event: SfxEvent) => void;
    play: (event: SfxEvent) => void;
    stop: (event: SfxEvent) => void;
    engine: AudioEngine;
}

export function useAudioEngine(
    orbState: AppOrbState,
    connected: boolean,
    heartbeatEnabled = false,
    options: UseAudioEngineOptions = {},
): UseAudioEngineReturn {
    const [engine] = useState<AudioEngine>(getAudioEngine);
    const { soundBaseUrl, initialMuted = false } = options;

    useEffect(() => {
        if (soundBaseUrl !== undefined) engine.setSoundBaseUrl(soundBaseUrl);
    }, [engine, soundBaseUrl]);

    const [isMuted, setIsMuted] = useState<boolean>(() => readStoredMute() ?? initialMuted);

    useEffect(() => {
        engine.setMuted(isMuted);
    }, [engine, isMuted]);

    const bootFiredRef = useRef(false);
    const prevOrbStateRef = useRef<AppOrbState | null>(null);
    const wakeGuardActiveRef = useRef(false);

    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const disconnectSfxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const offlineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const heartbeatEnabledRef = useRef(heartbeatEnabled);
    useEffect(() => {
        heartbeatEnabledRef.current = heartbeatEnabled;
    }, [heartbeatEnabled]);

    const clearIdleTimer = useCallback(() => {
        if (idleTimerRef.current !== null) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
    }, []);

    const stopIdleLoops = useCallback(() => {
        clearIdleTimer();
        engine.stop('idle_pulse');
        engine.stop('heartbeat');
    }, [clearIdleTimer, engine]);

    const startIdleTimer = useCallback(() => {
        clearIdleTimer();
        idleTimerRef.current = setTimeout(() => {
            if (!engine) return;
            engine.play('idle_pulse');
            if (heartbeatEnabledRef.current) engine.play('heartbeat');
        }, IDLE_TIMEOUT_MS);
    }, [clearIdleTimer, engine]);

    useEffect(() => {
        if (!engine) return;

        const resume = (): void => {
            void engine.resumeContext().then(() => {
                if (!bootFiredRef.current) {
                    bootFiredRef.current = true;
                    engine.playOneShot('boot');
                }
                const s = prevOrbStateRef.current;
                if (s === 'idle' || s === 'follow_up' || s === null) {
                    engine.play('ambient');
                } else if (s === 'listening') {
                    engine.play('scan');
                    engine.setDucking(true);
                } else if (s === 'thinking') {
                    engine.play('thinking');
                } else if (s === 'working') {
                    engine.play('working');
                }
            });
        };

        document.addEventListener('pointerdown', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });

        return () => {
            document.removeEventListener('pointerdown', resume);
            document.removeEventListener('keydown', resume);
        };
    }, [engine]);

    useEffect(() => {
        if (!engine) return;

        const onVisible = (): void => {
            if (document.visibilityState === 'visible') {
                void engine.resumeContext();
            }
        };

        document.addEventListener('visibilitychange', onVisible);
        return () => {
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [engine]);

    useEffect(() => {
        const onUnload = (): void => {
            engine.playOneShot('shutdown');
        };
        window.addEventListener('beforeunload', onUnload);
        return () => {
            window.removeEventListener('beforeunload', onUnload);
        };
    }, [engine]);

    useEffect(() => {
        if (!engine) return;

        const prev = prevOrbStateRef.current;
        prevOrbStateRef.current = orbState;

        if (prev === orbState) return;

        if (prev !== null) {
            const suppressStateChange = orbState === 'listening' && wakeGuardActiveRef.current;
            if (!suppressStateChange) {
                engine.playOneShot('state_change');
            }
        }

        if (prev === 'listening') {
            engine.setDucking(false);
            engine.playOneShot('mic_close');
        } else if (prev === 'speaking') {
            engine.setDucking(false);
            const isBargeIn = orbState === 'listening';
            if (isBargeIn) {
                engine.playOneShot('barge_in');
            } else {
                engine.playOneShot('speech_end');
            }
        } else if (prev === 'thinking') {
            engine.stop('thinking');
            engine.stop('scan');
        } else if (prev === 'working') {
            engine.stop('working');
            engine.stop('thinking');
            engine.stop('scan');
        }

        if (orbState === 'idle' || orbState === 'follow_up') {
            stopIdleLoops();
            engine.play('ambient');
            startIdleTimer();
        } else if (orbState === 'listening') {
            stopIdleLoops();
            engine.setDucking(true);
            engine.playOneShot('mic_open');
        } else if (orbState === 'thinking') {
            stopIdleLoops();
            engine.play('thinking');
        } else if (orbState === 'working') {
            stopIdleLoops();
            engine.stop('thinking');
            engine.stop('scan');
            engine.play('working');
        } else if (orbState === 'speaking') {
            stopIdleLoops();
            engine.setDucking(true);
            engine.playOneShot('speech_start');
        }
    }, [engine, orbState, startIdleTimer, stopIdleLoops]);

    useEffect(() => {
        if (!connected) {
            disconnectSfxTimerRef.current = setTimeout(() => {
                engine.playOneShot('disconnect');
            }, DISCONNECT_SFX_GATE_MS);

            offlineTimerRef.current = setTimeout(() => {
                engine.playOneShot('offline');
            }, OFFLINE_DELAY_MS);
        } else {
            if (disconnectSfxTimerRef.current !== null) {
                clearTimeout(disconnectSfxTimerRef.current);
                disconnectSfxTimerRef.current = null;
            }
            if (offlineTimerRef.current !== null) {
                clearTimeout(offlineTimerRef.current);
                offlineTimerRef.current = null;
            }
        }

        return () => {
            if (disconnectSfxTimerRef.current !== null) {
                clearTimeout(disconnectSfxTimerRef.current);
                disconnectSfxTimerRef.current = null;
            }
            if (offlineTimerRef.current !== null) {
                clearTimeout(offlineTimerRef.current);
                offlineTimerRef.current = null;
            }
        };
    }, [connected, engine]);

    useEffect(() => {
        if ((orbState === 'idle' || orbState === 'follow_up') && idleTimerRef.current === null) {
            if (heartbeatEnabled) {
                engine.play('heartbeat');
            } else {
                engine.stop('heartbeat');
            }
        }
    }, [engine, heartbeatEnabled, orbState]);

    useEffect(() => {
        return () => {
            clearIdleTimer();
            engine.stop('ambient');
            engine.stop('scan');
            engine.stop('thinking');
            engine.stop('working');
            engine.stop('idle_pulse');
            engine.stop('heartbeat');
            engine.stop('drag_move');
            engine.stop('resize');
            bootFiredRef.current = false;
            prevOrbStateRef.current = null;
        };
    }, [clearIdleTimer, engine]);

    const toggleMute = useCallback(() => {
        const next = !engine.isMuted;
        engine.setMuted(next);
        setIsMuted(next);
        writeStoredMute(next);
    }, [engine]);

    const playOneShot = useCallback(
        (event: SfxEvent) => {
            engine.playOneShot(event);
        },
        [engine],
    );

    const play = useCallback(
        (event: SfxEvent) => {
            engine.play(event);
        },
        [engine],
    );

    const stop = useCallback(
        (event: SfxEvent) => {
            engine.stop(event);
        },
        [engine],
    );

    void WAKE_GUARD_MS;

    return {
        isMuted,
        toggleMute,
        playOneShot,
        play,
        stop,
        engine: engine,
    };
}

export default useAudioEngine;
