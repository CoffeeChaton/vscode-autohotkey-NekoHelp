/* eslint-disable no-template-curly-in-string */

/**
 * <https://www.autohotkey.com/docs/v1/lib/SysGet.htm>
 */
export type TSysGetCmdElement = Readonly<{
    SubCommand: string,
    body: `SysGet, \${1:OutputVar}, ${string}`,
    doc: string,
    link: `https://www.autohotkey.com/docs/v1/lib/SysGet.htm#${string}`,
    exp: readonly string[],
}>;

/**
 * after initialization clear
 */
export const SysGetSubCmdList: TSysGetCmdElement[] = [
    // V-------- warn
    {
        SubCommand: '(Numeric)',
        body: 'SysGet, ${1:OutputVar}, ${2:N}',
        doc: 'Specify for _SubCommand_ one of the numbers from the tables below to retrieve the corresponding value.',
        link: 'https://www.autohotkey.com/docs/v1/lib/SysGet.htm#Numeric',
        exp: [
            'SysGet, OutputVar, N',
            '',
            'SysGet, MouseButtonCount, 43',
        ],
    },
    // normal
    {
        SubCommand: 'MonitorCount',
        body: 'SysGet, ${1:OutputVar}, MonitorCount',
        doc: 'Retrieves the total number of monitors.',
        link: 'https://www.autohotkey.com/docs/v1/lib/SysGet.htm#MonitorCount',
        exp: [
            'SysGet, OutputVar, MonitorCount',
        ],
    },
    {
        SubCommand: 'MonitorPrimary',
        body: 'SysGet, ${1:OutputVar}, MonitorPrimary',
        doc: 'Retrieves the number of the primary monitor.',
        link: 'https://www.autohotkey.com/docs/v1/lib/SysGet.htm#MonitorPrimary',
        exp: [
            'SysGet, OutputVar, MonitorPrimary',
        ],
    },
    {
        SubCommand: 'Monitor',
        body: 'SysGet, ${1:OutputVar}, Monitor ,[ ${2:N}]',
        doc: 'Changes the text/caption of the control.',
        link: 'https://www.autohotkey.com/docs/v1/lib/SysGet.htm#Monitor',
        exp: [
            'SysGet, OutputVar, Monitor , N',
            '',
            'SysGet, Mon2, Monitor, 2',
            'MsgBox, Left: %Mon2Left% -- Top: %Mon2Top% -- Right: %Mon2Right% -- Bottom %Mon2Bottom%.',
        ],
    },
    {
        SubCommand: 'MonitorWorkArea',
        body: 'SysGet, ${1:OutputVar}, MonitorWorkArea ,[ ${2:N}]',
        doc: 'Retrieves the working area\'s bounding coordinates of monitor number _N_.',
        link: 'https://www.autohotkey.com/docs/v1/lib/SysGet.htm#MonitorWorkArea',
        exp: [
            'SysGet, OutputVar, MonitorWorkArea , N',
        ],
    },
    {
        SubCommand: 'MonitorName',
        body: 'SysGet, ${1:OutputVar}, MonitorName ,[ ${2:N}]',
        doc: 'Retrieves the operating system\'s name of monitor number _N_.',
        link: 'https://www.autohotkey.com/docs/v1/lib/SysGet.htm#MonitorName',
        exp: [
            'SysGet, OutputVar, MonitorName , N',
        ],
    },
];
