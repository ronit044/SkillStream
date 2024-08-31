import React, { useEffect } from "react";
import axios from "axios";
import "../../axios";

import Card from "../../components/card/card";
import CardHolder from "../../components/cardholder/CardHolder";
import SearchBar from "../../components/searchbar/searchbar";
import Header from "../../layouts/header/header";
import Scroll from "../../components/scroll-to-top/scroll";
import CustomLoading from "../../components/custom-loading/CustomLoading";

import { useGlobalContext } from "../../context-provider/context-provider";

let courseLoaded = false;

const HomePage = () => {
    const {
        allCoursesLoading,
        setAllCoursesLoading,
        courseArray,
        setCourseArray,
    } = useGlobalContext();

    useEffect(() => {
        document.title = "SkillStream | Home";
    }, []);

    useEffect(() => {
        if (!courseLoaded) {
            setAllCoursesLoading(true);
            const getCourses = async () => {
                try {
                    const { data } = await axios.get(`/courses`);
                    setCourseArray(data.allCourses);
                    setAllCoursesLoading(false);
                } catch (error) {
                    setAllCoursesLoading(false);
                    console.log(error);
                }
            };
            getCourses();
            return () => {
                courseLoaded = true;
            };
        }
    });

    return (
        <CardHolder>
            <Header />
            <SearchBar />
            <CustomLoading isLoading={allCoursesLoading} />
            {courseArray.map((Course) => {
                return (
                    !allCoursesLoading && (
                        <Card
                            key={Course.code}
                            code={Course.code}
                            imageurl={Course.imageurl}
                            tags={Course.tags}
                            title={Course.title}
                            instructor={Course.instructor}
                            description={Course.description}
                            courseurl={Course.courseurl}
                        />
                    )
                );
            })}
            <Scroll />
        </CardHolder>
    );
};

export default HomePage;
