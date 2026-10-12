import logoDark from '../../assets/logohtl.png';
import logoLight from '../../assets/logohtlrojo.png';

const Logo = ({ className }) => (
    <>
        <img src={logoDark} alt="HTL Elevadores" className={`${className} hidden dark:block`} />
        <img src={logoLight} alt="HTL Elevadores" className={`${className} dark:hidden`} />
    </>
);

export default Logo;