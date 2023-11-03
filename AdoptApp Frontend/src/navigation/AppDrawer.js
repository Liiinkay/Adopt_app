import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppStackGroup from "./AppNavigator";

const Drawer = createDrawerNavigator();

const AppDrawerGroup = () => {
    return(
        <Drawer.Navigator>
            <Drawer.Screen name="AppStackGroup" component={AppStackGroup} />
        </Drawer.Navigator>
    )
}

export default AppDrawerGroup;
