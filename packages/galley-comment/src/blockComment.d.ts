declare interface Options {
  readonly env: string;
  readonly className: string | null;
}

declare type PartialOptions = { [O in keyof Options]?: Options[O] };
