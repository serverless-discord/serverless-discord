import { Config } from 'jest';
import baseConfig from './jest.config';


const config: Config = {
    ...baseConfig,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.integration\\.(jsx?|tsx?)$',
}

export default config;