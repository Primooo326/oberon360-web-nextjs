import { useFiltrosMapa } from "@/states/FiltrosMapa.state";

import type { IItinerario, IVehiculo } from "@/models/vehiculos.model";
import { create } from "zustand";
import { useVehiculosStore } from "./Vehiculos.state";
interface ItemsSidebarRight {
    item: "vehiculos" | "ubicaciones";
    content: IVehiculo | any;
    itinerario: IItinerario[] | null
}
interface SystemState {
    theme: string;
    setTheme: (theme: string) => void;
    showSidebar: boolean;
    setShowSidebar: (showSidebar: boolean) => void;
    itemSidebarRight: {
        item: "vehiculos" | "ubicaciones";
        content: IVehiculo | any;
        itinerario: IItinerario[] | null

    },
    setItemSidebarRight: (itemSidebarRight: ItemsSidebarRight) => void;
    showSidebarRight: boolean;
    setShowSidebarRight: (showSidebarRight: boolean) => void;
    mapExpand: boolean;
    setMapExpand: (mapExpand: boolean) => void;
    mapConfig: {
        zoom: number;
        fixed: boolean;
        center: { lat: number; lng: number; };
        showLoadMap: boolean;
    }
    setMapConfig: (mapConfig: {
        zoom: number;
        fixed: boolean;
        center: { lat: number; lng: number; };
        showLoadMap: boolean;
    }) => void;
    resetMapConfig: () => void;
}

export const useSystemStore = create<SystemState>((set) => ({
    theme: "oberon",
    setTheme: (theme) => set({ theme }),
    showSidebar: false,
    setShowSidebar: (showSidebar) => set({ showSidebar }),
    mapExpand: false,
    setMapExpand: (mapExpand) => set({ mapExpand }),
    mapConfig: {
        zoom: 5,
        fixed: true,
        center: { lat: 3.3345374, lng: -74.2701511, },
        showLoadMap: false
    },
    setMapConfig: (mapConfig) => set({ mapConfig }),
    itemSidebarRight: {} as ItemsSidebarRight,
    setItemSidebarRight: (itemSidebarRight) => {


        if (useSystemStore.getState().showSidebarRight) {
            useFiltrosMapa.setState({
                proteccionFiltro: false,
                telemetriaFiltro: true,
                mobileFiltro: false
            })
        } else {
            //reset map config

        }



        return set({ itemSidebarRight })
    },
    showSidebarRight: false,
    setShowSidebarRight: (showSidebarRight) => set({ showSidebarRight }),
    resetMapConfig: () => {
        set({
            mapConfig: {
                zoom: 5,
                fixed: true,
                center: { lat: 3.3345374, lng: -74.2701511, },
                showLoadMap: true
            }
        })
        setTimeout(() => {
            set({
                mapConfig: {
                    zoom: 5,
                    fixed: true,
                    center: { lat: 3.3345374, lng: -74.2701511, },
                    showLoadMap: false
                }
            })
        }, 1000);
        useSystemStore.setState({
            itemSidebarRight: {} as ItemsSidebarRight
        });
    }
}));

