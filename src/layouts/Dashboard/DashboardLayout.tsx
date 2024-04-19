import Sidebar from "@/Componentes/DashboardComponents/Sidebar/Sidebar"
import "./DashboardLayout.css"
import SidebarRight from "@/Componentes/DashboardComponents/SidebarRight/SidebarRight"
import { useSystemStore } from '../../states/System.state';
import { getEventsPlates, getEventsMotorcycle, ubicacionesClientes, getClients, reportsIndicators } from "@/api/mapa.api";
import IconoCargando from "@/Componentes/IconoCargando/IconoCargando";
import { useClientesStore } from "@/states/Clientes.state";
import { useLoginStore } from "@/states/Login.state";
import { useMobilesStore } from "@/states/Mobiles.state";
import { useUbicaciones } from "@/states/Ubicaciones.state";
import { useVehiculosStore } from "@/states/Vehiculos.state";
import { verifyJWT } from "@/tools";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"
import Cookies from "js-cookie";
import { useIndicadoresStore } from "@/states/Indicadores.state";
import MainLayout from '../MainLayout';
import { AnimatePresence, motion } from "framer-motion";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { setUbicaciones } = useUbicaciones()
    const { setClientes, clienteSelected } = useClientesStore()
    const { setToken, token } = useLoginStore.getState()
    const { setVehiculos } = useVehiculosStore()
    const { setMobiles } = useMobilesStore()
    const { setIndicadores } = useIndicadoresStore()
    const { theme, itemSidebarRight, setItemSidebarRight, showSidebar, setMapConfig, mapConfig, mapExpand } = useSystemStore()
    const itemSidebarRightRef = useRef(itemSidebarRight);
    const mapConfigRef = useRef(mapConfig);
    const [load, setLoad] = useState(false)
    const verify = async () => {
        const token = Cookies.get("token")
        console.log(token);
        if (token) {
            const tokenValid = await verifyJWT(token)
            if (tokenValid) {
                setToken(token)
                await getData()
            } else {
                Cookies.remove("token")
                setToken("")
                router.push("/auth")
            }
        } else {
            Cookies.remove("token")
            setToken("")
            router.push("/auth")
        }
    }
    const getVehiculos = async () => {
        const response = await getEventsPlates();
        setVehiculos(response);
        if (itemSidebarRightRef.current != null && itemSidebarRightRef.current.item === "vehiculos" && mapConfigRef.current.fixed) {
            const vehiculo = response.find((vehiculo: any) => vehiculo.WTLT_PLACA === itemSidebarRightRef.current!.content.WTLT_PLACA)

            setItemSidebarRight({
                item: "vehiculos",
                content: vehiculo
            })

            setMapConfig({
                zoom: 15,
                fixed: true,
                center: {
                    lat: Number.parseFloat(`${vehiculo.WTLT_LAT}`),
                    lng: Number.parseFloat(`${vehiculo.WTLT_LON}`)
                }
            })

        }
    }
    const getMobiles = async () => {
        const response = await getEventsMotorcycle()
        setMobiles(response)
    }
    const getData = async () => {

        try {
            const response = await ubicacionesClientes();
            setUbicaciones(response);
            const responseClient = await getClients()
            let clientes = []
            if (responseClient.data.find((cliente: any) => cliente.CLIE_ID_REG === "34")) {
                clientes = responseClient.data
            } else {
                clientes = [{
                    CLIE_ID_REG: "34",
                    CLIE_COMERCIAL: "ALPINA"
                }, ...responseClient.data]
            }
            setClientes(clientes);
        } catch (error: any) {
            console.log(error);
            if (error.code === "ERR_NETWORK") {
                toast.error("Error de conexión con el servidor.", { autoClose: 5000 })

            } else {
                toast.error("Error al cargar los datos", { autoClose: 5000 })
            }
            throw new Error("Error al cargar los datos")
        }

    }
    const getIndicadores = async () => {
        try {
            const response = await reportsIndicators();
            setIndicadores(response)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        itemSidebarRightRef.current = itemSidebarRight;
    }, [itemSidebarRight]);

    useEffect(() => {
        mapConfigRef.current = mapConfig;
    }, [mapConfig]);

    useEffect(() => {
        verify().finally(() => setLoad(true))
    }, [])

    useEffect(() => {

        const interval = setInterval(() => {
            getVehiculos();
            getMobiles();
            getIndicadores();
        }, 5000);
        if (token) {
            if (!clienteSelected) {
                getData();
                getVehiculos();
                getIndicadores();
                return () => clearInterval(interval);
            }
        } else {
            clearInterval(interval);
        }
    }, [token])
    return (
        <MainLayout>
            {load ?
                <main className="mainDashboard relative" data-theme={theme}>
                    <Sidebar />


                    <AnimatePresence>

                        <motion.section
                            initial={{ position: "relative", width: showSidebar ? "calc(100% - 464px)" : "calc(100% - 64px)" }}
                            animate={{ right: 0, position: "absolute", width: showSidebar ? "calc(100% - 464px)" : "calc(100% - 64px)" }}
                            exit={{ width: showSidebar ? "calc(100% - 464px)" : "100%" }}
                            transition={{ type: 'linear', stiffness: 200 }}
                            style={{ overflow: 'hidden', position: "absolute" }}
                            className="w-full h-full scroll"
                        >
                            {children}
                        </motion.section>

                    </AnimatePresence>
                    <AnimatePresence>
                        {(itemSidebarRight && mapExpand) && (

                            <motion.div
                                initial={{ position: 'relative', x: '100%' }}
                                animate={{ position: 'absolute', right: 0, x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'linear', stiffness: 200 }}
                                className="h-full z-10">

                                <SidebarRight item={itemSidebarRight.item} content={itemSidebarRight.content} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                </main>
                :
                <IconoCargando />
            }
        </MainLayout>

    )
}
