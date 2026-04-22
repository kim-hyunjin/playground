export type Contents = {
    label: string;
    text?: string;
    editable?: boolean;
    computed?: () => string;
};
