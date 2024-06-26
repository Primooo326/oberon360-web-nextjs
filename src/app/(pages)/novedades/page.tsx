"use client"
import SidebarRight from '@/components/NovedadesComponents/SidebarRight/SidebarRight'
import TableNovedad from '@/components/NovedadesComponents/TableNovedad/TableNovedad'
import { useNovedadesStore } from '@/states/novedades.state'
import { PieChart } from '@mui/x-charts/PieChart'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

type tipoAlerta = "Fuera de Ruta" | "Exceso de Velocidad" | "Frenado Brusco" | "Aceleración Brusca" | "Retraso en Ruta";
export default function page() {

    const { novedadSelected } = useNovedadesStore()

    const dataChart = [

        {
            value: 10,
            color: "yellow",
            label: "Aceleración Brusca"
        },
        {
            value: 10, color: "red",
            label: "Exceso de Velocidad"
        },
        {
            value: 20, color: "#6931ba",
            label: "Frenado Brusco"
        },
        {
            value: 20, color: "#00df90",
            label: "Fuera de Ruta"
        },
        {
            value: 50, color: "#3b82f6",
            label: "Retraso en Ruta"
        }
    ]

    return (
        <div className='w-full h-full scroll p-8' >

            <div className="flex gap-5 mb-8 items-center">
                <h1 className='font-bold text-3xl' >
                    Novedades
                </h1>

                <button className="btn btn-outline btn-sm text-white bg-green-500">
                    Finalizado
                </button>
                <button className="btn btn-outline btn-sm text-white bg-red-500">
                    Pendiente
                </button>
                <button className="btn btn-outline btn-sm text-white bg-yellow-500">
                    En proceso
                </button>

            </div>

            <TableNovedad />

            {/* <div className=" w-[350px] h-[350px]">

                <PieChart
                    series={[
                        {
                            data: dataChart,
                            innerRadius: 20,
                            outerRadius: 80,
                            paddingAngle: 5,
                            startAngle: -90,
                            cx: 150,
                            cy: 150,

                        }
                    ]}

                />
            </div> */}

            <AnimatePresence>

                {novedadSelected && (
                    <motion.div
                        initial={{ x: "100" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100" }}
                        transition={{ type: "linear", stiffness: 200 }}
                        className="z-10"
                    >
                        <SidebarRight />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
