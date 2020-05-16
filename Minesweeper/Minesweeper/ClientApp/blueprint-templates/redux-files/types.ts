export const SAMPLE_TYPE_KEY = "SAMPLE_TYPE_KEY";
export const SAMPLE_TYPE_KEY2 = "SAMPLE_TYPE_KEY2";

export interface SampleAction1 {
    type: "SAMPLE_TYPE_KEY";
}

export interface SampleAction2 {
    type: "SAMPLE_TYPE_KEY2";
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = SampleAction1 | SampleAction2;