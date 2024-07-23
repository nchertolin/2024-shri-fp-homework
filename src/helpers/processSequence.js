import Api from '../tools/api';
import { __, allPass, andThen, gt, ifElse, length, lt, pipe, tap, test, tryCatch } from 'ramda';

const api = new Api();
const getConvertedNumber = api.get('https://api.tech/numbers/base');

const isNumber = test(/^\d*\.?\d+$/);
const isValidLength = pipe(length, allPass([gt(__, 2), lt(__, 10)]));
const isPositive = pipe(parseFloat, gt(__, 0));
const round = Math.round;
const validate = allPass([isNumber, isValidLength, isPositive]);


const convertToBinary = async (number) => {
    const response = await getConvertedNumber({ from: 10, to: 2, number: number.toString() })
    return response.result;
};

const getAnimal = async (id) => {
    const response = await api.get(`https://animals.tech/${id}`)(undefined);
    return response.result;
};


const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const handleErrorValidation = () => handleError('ValidationError');
    
    const process = pipe(
        convertToBinary,
        andThen(pipe(
            tap(writeLog),
            length,
            tap(writeLog),
            length => length ** 2,
            tap(writeLog),
            squared => squared % 3,
            tap(writeLog),
            getAnimal,
            andThen(handleSuccess)
        )),
    );
    
    const handleSuccessValidation = pipe(
        tap(writeLog),
        parseFloat,
        round,
        tap(writeLog),
        tryCatch(process, handleError)
    );
    
    pipe(ifElse(validate, handleSuccessValidation, handleErrorValidation))(value);
};

export default processSequence;
