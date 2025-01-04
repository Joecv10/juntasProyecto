import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { capitalizeEachWord } from "../../../utilFunctions/functions.js";

const JuntasRiegoIndex = () => {
    const { user } = usePage().props.auth;

    const { cod_oficina_tecnica } = user;

    // States for Provincia:
    const [provinceQuery, setProvinceQuery] = useState(""); // Pre-filled with provincia name
    const [selectedProvince, setSelectedProvince] = useState(null); // { id, nombre }
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [errorProvinces, setErrorProvinces] = useState("");

    // States for Cantón:
    const [cantonQuery, setCantonQuery] = useState("");
    const [cantones, setCantones] = useState([]);
    const [selectedCanton, setSelectedCanton] = useState(null);
    const [isLoadingCantones, setIsLoadingCantones] = useState(false);
    const [errorCantones, setErrorCantones] = useState("");

    // States for Parroquia:
    const [parishQuery, setParishQuery] = useState("");
    const [parroquias, setParroquias] = useState([]);
    const [selectedParish, setSelectedParish] = useState(null);
    const [isLoadingParroquias, setIsLoadingParroquias] = useState(false);
    const [errorParroquias, setErrorParroquias] = useState("");

    //
    // 1) PROVINCIA: Automatically set based on cod_oficina_tecnica
    //

    useEffect(() => {
        const fetchProvinciaExacta = async () => {
            if (!cod_oficina_tecnica) {
                console.error("No se proporcionó la oficina tecnica.");
                return;
            }

            setIsLoadingProvinces(true);
            setErrorProvinces("");

            try {
                const { data } = await axios.get(
                    route("oficina-tecnica.provincia", {
                        cod_oficina_tecnica,
                    })
                );
                // data => { provincia_id, provincia }
                console.log(data);
                // Set selectedProvince
                setSelectedProvince({
                    id: data.id,
                    nombre: data.provincia,
                });
                setProvinceQuery(data.provincia);
            } catch (err) {
                console.error("No se encontró la provincia:", err);
                setErrorProvinces("No se pudo cargar la provincia.");
            } finally {
                setIsLoadingProvinces(false);
            }
        };

        fetchProvinciaExacta();
    }, []);

    //
    // 2) CANTÓN: Enabled only if selectedProvince is set
    //

    const handleCantonChange = async (e) => {
        const value = e.target.value;
        setCantonQuery(value);
        setSelectedCanton(null);
        setParishQuery("");
        setSelectedParish(null);
        setParroquias([]);
        setCantones([]);
        setErrorCantones("");

        if (!value || !selectedProvince) {
            setCantones([]);
            return;
        }

        setIsLoadingCantones(true);
        try {
            const { data } = await axios.get(route("cantones.buscar"), {
                params: {
                    term: value,
                    provincia_id: selectedProvince.id,
                },
            });
            setCantones(data); // Array de { id, nombre }
        } catch (error) {
            console.error("Error fetching Cantones:", error);
            setErrorCantones("No se pudo cargar los cantones.");
        } finally {
            setIsLoadingCantones(false);
        }
    };

    const selectCanton = (canton) => {
        setSelectedCanton(canton);
        setCantonQuery(canton.nombre);
        setCantones([]);
    };

    //
    // 3) PARROQUIA: Enabled only if selectedCanton is set
    //

    const handleParishChange = async (e) => {
        const value = e.target.value;
        setParishQuery(value);
        setSelectedParish(null);
        setParroquias([]);
        setErrorParroquias("");

        if (!value || !selectedCanton) {
            setParroquias([]);
            return;
        }

        setIsLoadingParroquias(true);
        try {
            const { data } = await axios.get(route("parroquias.buscar"), {
                params: {
                    term: value,
                    canton_id: selectedCanton.id,
                },
            });
            setParroquias(data); // Array de { id, nombre }
        } catch (error) {
            console.error("Error fetching Parroquias:", error);
            setErrorParroquias("No se pudo cargar las parroquias.");
        } finally {
            setIsLoadingParroquias(false);
        }
    };

    const selectParish = (par) => {
        setSelectedParish(par);
        setParishQuery(par.nombre);
        setParroquias([]);
    };

    //
    // 4) Submit final
    //

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProvince || !selectedCanton || !selectedParish) {
            alert("Faltan datos: provincia, cantón o parroquia");
            return;
        }
        // Aquí harías un axios.post o Inertia.post a tu ruta de guardado
        alert(
            `Guardando:\n` +
                `Provincia ID: ${selectedProvince.id} (${selectedProvince.nombre})\n` +
                `Canton ID: ${selectedCanton.id} (${selectedCanton.nombre})\n` +
                `Parroquia ID: ${selectedParish.id} (${selectedParish.nombre})\n`
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Juntas Riego" />

            <div className="flex min-h-screen flex-col bg-gray-100 pt-6 sm:pt-0">
                <div className="mt-6 w-full max-w-5xl mx-auto overflow-hidden bg-white px-6 py-4 shadow-md sm:rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* PROVINCIA */}
                        <div className="relative">
                            <label
                                htmlFor="provincia"
                                className="block font-medium text-sm text-gray-700 mb-1"
                            >
                                Provincia
                            </label>

                            {/* Provincia is locked and pre-filled */}
                            {isLoadingProvinces ? (
                                <p className="text-gray-500">
                                    Cargando provincia...
                                </p>
                            ) : errorProvinces ? (
                                <p className="text-red-500">{errorProvinces}</p>
                            ) : (
                                <input
                                    type="text"
                                    id="provincia"
                                    className="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full bg-gray-100 cursor-not-allowed"
                                    value={capitalizeEachWord(provinceQuery)}
                                    readOnly
                                />
                            )}
                        </div>

                        {/* CANTÓN */}
                        <div className="relative">
                            <label
                                htmlFor="canton"
                                className="block font-medium text-sm text-gray-700 mb-1"
                            >
                                Cantón
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="canton"
                                    className="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full disabled:bg-gray-100"
                                    value={capitalizeEachWord(cantonQuery)}
                                    onChange={handleCantonChange}
                                    placeholder="Escribe un cantón..."
                                    disabled={!selectedProvince}
                                />
                                {isLoadingCantones && (
                                    <p className="text-gray-500 mt-1">
                                        Cargando cantones...
                                    </p>
                                )}
                                {errorCantones && (
                                    <p className="text-red-500 mt-1">
                                        {errorCantones}
                                    </p>
                                )}
                                {cantones.length > 0 && (
                                    <ul className="absolute bg-white border border-gray-200 mt-1 w-full rounded-md shadow z-10 max-h-60 overflow-y-auto">
                                        {cantones.map((can) => (
                                            <li
                                                key={can.id}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() =>
                                                    selectCanton(can)
                                                }
                                            >
                                                {can.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* PARROQUIA */}
                        <div className="relative">
                            <label
                                htmlFor="parroquia"
                                className="block font-medium text-sm text-gray-700 mb-1"
                            >
                                Parroquia
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="parroquia"
                                    className="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm w-full disabled:bg-gray-100"
                                    value={capitalizeEachWord(parishQuery)}
                                    onChange={handleParishChange}
                                    placeholder="Escribe una parroquia..."
                                    disabled={!selectedCanton}
                                />
                                {isLoadingParroquias && (
                                    <p className="text-gray-500 mt-1">
                                        Cargando parroquias...
                                    </p>
                                )}
                                {errorParroquias && (
                                    <p className="text-red-500 mt-1">
                                        {errorParroquias}
                                    </p>
                                )}
                                {parroquias.length > 0 && (
                                    <ul className="absolute bg-white border border-gray-200 mt-1 w-full rounded-md shadow z-10 max-h-60 overflow-y-auto">
                                        {parroquias.map((par) => (
                                            <li
                                                key={par.id}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() =>
                                                    selectParish(par)
                                                }
                                            >
                                                {par.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* BOTÓN GUARDAR */}
                        <div>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border 
                                        border-transparent rounded-md font-semibold text-xs 
                                        text-white uppercase tracking-widest hover:bg-indigo-700 
                                        focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none 
                                        focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                                        transition ease-in-out duration-150 disabled:bg-gray-400"
                                disabled={
                                    !selectedProvince ||
                                    !selectedCanton ||
                                    !selectedParish
                                }
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default JuntasRiegoIndex;
