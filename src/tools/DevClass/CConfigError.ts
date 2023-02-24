export class CConfigError extends Error {
    public readonly section: string;

    public constructor(section: string) {
        super(`${section}, not found err code--40--11--33-- at configUI.ts`);
        this.section = section;
        this.name = 'CConfigError';
    }
}
