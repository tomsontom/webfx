import {Region} from "../layout/Region";
import {Skinnable} from "./Skinnable";
import {Skin} from "./Skin";
import {SkinBase} from "./SkinBase";
import {Tooltip} from "./Tooltip";

export abstract class Control extends Region implements Skinnable {
    skin     : Skin<any>;
    skinBase : SkinBase<any>;
    tooltip  : Tooltip;



}