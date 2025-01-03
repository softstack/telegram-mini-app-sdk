import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useCallback, useEffect, useState } from 'react';
import Svg from 'react-inlinesvg';
import checkSolid from '../../assets/icons/check-solid.svg';
import chevronDownSolid from '../../assets/icons/chevron-down-solid.svg';
import chevronLeftSolid from '../../assets/icons/chevron-left-solid.svg';
import chevronUpSolid from '../../assets/icons/chevron-up-solid.svg';
import copyRegular from '../../assets/icons/copy-regular.svg';
import fileLinesRegular from '../../assets/icons/file-lines-regular.svg';
import xmarkSolid from '../../assets/icons/xmark-solid.svg';
import { tw } from '../../utils';
const SvgComponent = Svg;
const getSrc = (icon) => {
    switch (icon) {
        case 'checkSolid': {
            return checkSolid;
        }
        case 'chevronDownSolid': {
            return chevronDownSolid;
        }
        case 'chevronLeftSolid': {
            return chevronLeftSolid;
        }
        case 'chevronUpSolid': {
            return chevronUpSolid;
        }
        case 'copyRegular': {
            return copyRegular;
        }
        case 'fileLinesRegular': {
            return fileLinesRegular;
        }
        case 'xmarkSolid': {
            return xmarkSolid;
        }
    }
};
export const SvgIcon = memo(({ icon, className, ...props }) => {
    const [src, setSrc] = useState(getSrc(icon));
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (isLoading || getSrc(icon) === src) {
            return;
        }
        setSrc(getSrc(icon));
        setIsLoading(true);
    }, [isLoading, src, icon]);
    const handleLoad = useCallback(() => {
        setIsLoading(false);
    }, []);
    return _jsx(SvgComponent, { src: src, className: tw('border-box', className), onLoad: handleLoad, ...props });
});
SvgIcon.displayName = 'SvgIcon';
//# sourceMappingURL=SvgIcon.js.map