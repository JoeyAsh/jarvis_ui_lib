import { useState, type ReactElement } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Slider } from '../../primitives/Slider';
import { Checkbox } from '../../primitives/Checkbox';
import { Textarea } from '../../primitives/Textarea';
import { RadioGroup } from '../../compositions/RadioGroup';
import { Select } from '../../compositions/Select';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';

export function FormsSection(): ReactElement {
    const [volume, setVolume] = useState(40);
    const [systems, setSystems] = useState<string[]>(['radar']);
    const [mode, setMode] = useState('night');
    const [notes, setNotes] = useState('Grows with its content.');
    const allSystems = ['radar', 'comms'];

    return (
        <section id="forms" className="flex flex-col gap-4">
            <SectionHeader title="Primitives · Forms">
                Slider · Checkbox · Textarea · RadioGroup · Select
            </SectionHeader>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ShowcaseCard
                    label="SLIDER"
                    code={`<Slider label="Volume" value={volume} onValueChange={setVolume} showValue />\n<Slider label="Gain" min={0} max={1} step={0.05} defaultValue={0.6} size="sm" showValue />\n<Slider aria-label="Locked" defaultValue={30} disabled />`}
                    dark
                >
                    <div className="flex flex-col gap-4">
                        <Slider
                            label="Volume"
                            value={volume}
                            onValueChange={setVolume}
                            showValue
                            formatValue={(v) => `${v} %`}
                        />
                        <Slider
                            label="Gain"
                            min={0}
                            max={1}
                            step={0.05}
                            defaultValue={0.6}
                            size="sm"
                            showValue
                        />
                        <Slider aria-label="Locked" defaultValue={30} disabled />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="CHECKBOX · INDETERMINATE"
                    code={`<Checkbox label="All" checked={all} indeterminate={some} onCheckedChange={…} />\n<Checkbox label="Radar" checked={…} onCheckedChange={…} />\n<Checkbox label="Locked" defaultChecked disabled size="sm" />`}
                    dark
                >
                    <div className="flex flex-col gap-2">
                        <Checkbox
                            label="All systems"
                            checked={systems.length === allSystems.length}
                            indeterminate={systems.length > 0 && systems.length < allSystems.length}
                            onCheckedChange={(on) => setSystems(on ? allSystems : [])}
                        />
                        {allSystems.map((name) => (
                            <Checkbox
                                key={name}
                                className="ml-5"
                                label={name}
                                checked={systems.includes(name)}
                                onCheckedChange={(on) =>
                                    setSystems(
                                        on ? [...systems, name] : systems.filter((s) => s !== name),
                                    )
                                }
                            />
                        ))}
                        <Checkbox label="Locked" defaultChecked disabled size="sm" />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="TEXTAREA · AUTO RESIZE · INVALID"
                    code={`<Textarea value={notes} onChange={…} autoResize rows={2} maxRows={5} />\n<Textarea invalid size="sm" rows={2} />`}
                    dark
                >
                    <div className="flex flex-col gap-2">
                        <Textarea
                            aria-label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            autoResize
                            rows={2}
                            maxRows={5}
                            fullWidth
                        />
                        <Textarea
                            aria-label="Invalid"
                            invalid
                            size="sm"
                            rows={2}
                            defaultValue="Checksum mismatch"
                            fullWidth
                        />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="RADIO GROUP"
                    code={`<RadioGroup aria-label="Quality" defaultValue="high" items={[…]} />\n<RadioGroup orientation="horizontal" size="sm" items={[…]} />`}
                    dark
                >
                    <div className="flex flex-col gap-4">
                        <RadioGroup
                            aria-label="Quality"
                            defaultValue="high"
                            items={[
                                { value: 'low', label: 'Low', description: 'Battery saver' },
                                { value: 'high', label: 'High' },
                                { value: 'ultra', label: 'Ultra', disabled: true },
                            ]}
                        />
                        <RadioGroup
                            aria-label="Units"
                            orientation="horizontal"
                            size="sm"
                            defaultValue="metric"
                            items={[
                                { value: 'metric', label: 'Metric' },
                                { value: 'imperial', label: 'Imperial' },
                            ]}
                        />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="SELECT"
                    code={`<Select aria-label="Mode" value={mode} onValueChange={setMode} options={[{ value: 'night', label: 'Night', icon: <Moon size={12} /> }, …]} />\n<Select aria-label="Voice" placeholder="Choose…" size="sm" options={[…]} />\n<Select invalid options={[…]} />`}
                    dark
                >
                    <div className="flex flex-col gap-2">
                        <Select
                            aria-label="Mode"
                            value={mode}
                            onValueChange={setMode}
                            options={[
                                { value: 'night', label: 'Night', icon: <Moon size={12} /> },
                                { value: 'day', label: 'Day', icon: <Sun size={12} /> },
                            ]}
                        />
                        <Select
                            aria-label="Voice"
                            placeholder="Choose a voice…"
                            size="sm"
                            options={[
                                { value: 'jarvis', label: 'JARVIS' },
                                { value: 'friday', label: 'FRIDAY' },
                                { value: 'edith', label: 'EDITH', disabled: true },
                            ]}
                        />
                        <Select
                            aria-label="Invalid"
                            invalid
                            options={[{ value: 'x', label: 'Unknown' }]}
                        />
                    </div>
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default FormsSection;
