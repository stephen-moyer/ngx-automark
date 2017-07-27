# ngx-automark

Automatically marks components for change detection in Angular. Similar to Fody's PropertyChanged in C#.

Reason behind this is to use the OnPush change detection strategy without having to worry about calling ChangeDetectorRef.markForCheck() everytime you update state.

EXPERIMENTAL. I would not use this. Just seeing if it's possible.
