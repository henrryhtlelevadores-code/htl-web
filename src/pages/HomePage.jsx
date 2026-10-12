import Hero from '../components/hero/Hero';
import CallIntro from '../components/hero/CallIntro';
import Backing from '../components/sections/Backing';
import Elevators from '../components/sections/Elevators';
import Software from '../components/sections/Software';
import Facility from '../components/sections/Facility';
import Aroma from '../components/sections/Aroma';
import Visit from '../components/sections/Visit';
import { useFloorTracking } from '../lib/floor';

const HomePage = () => {
    useFloorTracking();
    return (
        <>
            <CallIntro />
            <Hero />
            <Backing />
            <Elevators />
            <Software />
            <Facility />
            <Aroma />
            <Visit />
        </>
    );
};

export default HomePage;
