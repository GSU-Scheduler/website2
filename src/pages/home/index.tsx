import { CourseAdd } from "../../components/CourseAdd/CourseAdd";
import { Schedule } from "../../components/Schedule/Schedule";
import {Map} from '../../components/Map/Map';
export const Home = () => {
    return(
        <div className=''>
            <div className=''>
                <CourseAdd />
                <Schedule/>
                <Map/>
            </div>
            
        </div>
    )
};