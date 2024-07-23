import {
    __,
    all,
    allPass,
    any,
    count,
    curry,
    equals,
    filter,
    groupBy,
    gte,
    length,
    map,
    not,
    pipe,
    prop,
    propSatisfies,
    values
} from 'ramda';


const isWhite = equals('white');
const isRed = equals('red');
const isGreen = equals('green');
const isBlue = equals('blue');
const isOrange = equals('orange');
const isNotWhite = pipe(isWhite, not);
const isNotRed = pipe(isRed, not);

const countColor = curry(count);
const countGreen = countColor(isGreen);
const countRed = countColor(isRed);
const countBlue = countColor(isBlue);

const arePropsEqual = (a, b) => (obj) => equals(prop(a, obj), prop(b, obj));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    propSatisfies(isRed, 'star'),
    propSatisfies(isGreen, 'square'),
    propSatisfies(isWhite, 'triangle'),
    propSatisfies(isWhite, 'circle')
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(values, countGreen, gte(__, 2));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = pipe(
    values,
    (lst) => [countRed(lst), countBlue(lst)],
    ([red, blue]) => equals(red, blue)
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    propSatisfies(isBlue, 'circle'),
    propSatisfies(isRed, 'star'),
    propSatisfies(isOrange, 'square'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(
    values,
    filter(isNotWhite),
    groupBy(color => color),
    values,
    map(length),
    any(gte(__, 3))
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    propSatisfies(isGreen, 'triangle'),
    pipe(values, countGreen, equals(2)),
    pipe(values, countRed, equals(1))
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(values, all(isOrange));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    propSatisfies(isNotRed, 'star'),
    propSatisfies(isNotWhite, 'star'),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(values, all(isGreen));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    propSatisfies(isNotWhite, 'triangle'),
    arePropsEqual('triangle', 'square')
]);
