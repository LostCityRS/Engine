import { ClientBinaryType, JavaConfig } from './JavaConfig.ts';

const config = await JavaConfig.decodeFromRs3(ClientBinaryType.MacOS);

if (config) {
    config.launchRs3();
}
