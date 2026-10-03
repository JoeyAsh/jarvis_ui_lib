import type { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { BrandMark, IconButton, Link, Pill, Switch, TopBar, useJarvis } from '@ui';
import pkg from '../../../package.json';
import { hrefFor, REPO_URL } from '../utils/paths';
import type { DocsHeaderProps } from './DocsHeader.types';

export function DocsHeader({ menuOpen, onMenuToggle }: DocsHeaderProps): ReactElement {
    const navigate = useNavigate();
    const { isMuted, toggleMute } = useJarvis();

    return (
        <div className="sticky top-0 z-[30] px-[10px] pt-[10px] bg-[linear-gradient(var(--bg)_70%,transparent)]">
            <TopBar
                position="static"
                left={
                    <div className="flex items-center gap-3">
                        <IconButton
                            icon={menuOpen ? X : Menu}
                            label={menuOpen ? 'Close navigation' : 'Open navigation'}
                            size="sm"
                            className="lg:hidden"
                            aria-expanded={menuOpen}
                            onClick={onMenuToggle}
                        />
                        <a
                            href={hrefFor('')}
                            aria-label="jarvis-react-ui home"
                            className="docs-anchor flex items-center whitespace-nowrap"
                            onClick={(e) => {
                                e.preventDefault();
                                void navigate('/');
                            }}
                        >
                            <BrandMark />
                        </a>
                        <span className="hidden sm:inline-flex">
                            <Pill variant="info">DOCS</Pill>
                        </span>
                    </div>
                }
                center={
                    <span className="hidden md:inline text-[9px] tracking-[6px] text-text-muted uppercase">
                        jarvis-react-ui · v{pkg.version}
                    </span>
                }
                right={
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:flex items-center gap-4">
                            <Link href={REPO_URL} external variant="nav">
                                GitHub
                            </Link>
                            <Link
                                href="https://www.npmjs.com/package/jarvis-react-ui"
                                external
                                variant="nav"
                            >
                                npm
                            </Link>
                        </span>
                        <Switch
                            size="sm"
                            label="SFX"
                            checked={!isMuted}
                            onCheckedChange={toggleMute}
                        />
                    </div>
                }
            />
        </div>
    );
}

export default DocsHeader;
