import React, {createContext, useEffect, useMemo, useState, useContext} from 'react';
import useAuth from "./useAuth";

const ShopContext = createContext();

export const ShopProvider = ({children}) => {
    const {url} = useAuth();

    const [shops, setShops] = useState([]);
    const [loadingInitial, setLoadingInitial] = useState(true);

    const getShops = async () => {
        try {
            const res = await fetch(url + '/shops', {
                method: 'GET',
            });

            const data = await res.json();

            setShops(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getShops();

        setLoadingInitial(false)
    }, []);

    const memoedValue = useMemo(() => ({
        shops,
        getShops,
    }), [shops]);
    return (
        <ShopContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </ShopContext.Provider>
    );
};

export default function useShops() {
    return useContext(ShopContext);
}