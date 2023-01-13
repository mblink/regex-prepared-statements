import escapeStringRegexp from "escape-string-regexp";

type Flags = "d" | "g" | "i" | "m" | "s" | "u" | "y";

type OnlyAcceptedChars<AcceptedChars extends string, A extends string, Acc extends string = ""> =
    A extends AcceptedChars
    ? `${Acc}${A}`
    : A extends `${AcceptedChars}${infer Tail}`
    ? OnlyAcceptedChars<AcceptedChars, Tail, `${Acc}${AcceptedChars}`>
    : never;

type Instances<
    S extends string,
    Query extends string,
    Acc extends Query[] = []
> =
    // edge case: if `S` isn't a string literal/string union just return `string[]`
    string extends S ? string[] :
    //  edge case: if the query isn't a string literal/string union return never;
    string extends Query ? never :
    // base case: return the instances we'e accumulated
    S extends "" ? Acc :
    // recursive case: adds current match to accumulator and recurses with tail
    S extends `${string}${Query}${infer Rest}` ?
    Instances<Rest, Query, [...Acc, Query]> :
    Acc;

type InstancesToStrings<A extends string[]> = [...{ [K in keyof A]: string }];

export const regexp = <S extends string, F extends string>(r: S, flags?: OnlyAcceptedChars<Flags, F>) => (...strings: InstancesToStrings<Instances<S, "<_>">>): RegExp => {
    // eslint-disable-next-line no-restricted-syntax
    return new RegExp(r.replace(/<_>/g, () => escapeStringRegexp(strings.shift() || "")), flags);
};

export const regexpSimple = <F extends string>(str: string, flags?: OnlyAcceptedChars<Flags, F>) => regexp("<_>", flags)(str);
