import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

const JuntasRiegoIndex = () => {
    const { user } = usePage().props.auth;
    const isSuperadmin = user.role === "superadmin";

    // Suponiendo que sí tenemos user.provincia_oficina_tecnica_id
    // (Si solo tienes el nombre, deberías buscarlo en la DB antes)
    const lockedProvinceId = user.provincia_oficina_tecnica_id || null;
    const lockedProvinceName = user.provincia_oficina_tecnica; // "Chimborazo", etc.

    // Estados compartidos para provincia:
    const [provinceQuery, setProvinceQuery] = useState(""); // texto que escribe el superadmin
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    // { id, nombre } si es superadmin
    // o null si no es superadmin

    // Cantón:
    const [cantonQuery, setCantonQuery] = useState("");
    const [cantones, setCantones] = useState([]);
    const [selectedCanton, setSelectedCanton] = useState(null);

    // Parroquia:
    const [parishQuery, setParishQuery] = useState("");
    const [parroquias, setParroquias] = useState([]);
    const [selectedParish, setSelectedParish] = useState(null);

    //
    // 1) PROVINCIA: Si es superadmin, autocomplete. Si no, "lock" en su provincia
    //

    // A) superadmin => busca en /buscar-provincias
    const handleProvinceChange = async (e) => {
        const value = e.target.value;
        setProvinceQuery(value);
        setSelectedProvince(null);
        // Al cambiar provincia, limpias cantón y parroquia
        setCantonQuery("");
        setSelectedCanton(null);
        setCantones([]);
        setParishQuery("");
        setSelectedParish(null);
        setParroquias([]);

        if (!value) {
            setProvinces([]);
            return;
        }
        const { data } = await axios.get(route("provincias.buscar"), {
            params: { term: value },
        });
        setProvinces(data); // Array de { id, nombre }
    };

    const selectProvince = (prov) => {
        setSelectedProvince(prov);
        setProvinceQuery(prov.nombre);
        setProvinces([]);
    };

    // B) no superadmin => ya tenemos lockedProvinceId (y lockedProvinceName).
    // Podríamos ponerlo en useEffect para inicializar selectedProvince
    useEffect(() => {
        if (!isSuperadmin && lockedProvinceName) {
            const fetchProvinciaExacta = async () => {
                try {
                    const { data } = await axios.get(
                        route("provincia.byname"),
                        {
                            params: { name: lockedProvinceName },
                        }
                    );
                    // data => { provincia_id, provincia }

                    // Seteamos selectedProvince
                    setSelectedProvince({
                        id: data.provincia_id,
                        nombre: data.provincia,
                    });
                    setProvinceQuery(data.provincia);
                } catch (err) {
                    console.error("No se encontró la provincia:", err);
                }
            };

            fetchProvinciaExacta();
        }
    }, [isSuperadmin, lockedProvinceName]);

    //
    // 2) CANTÓN: se habilita solo si selectedProvince no es null
    //
    const handleCantonChange = async (e) => {
        const value = e.target.value;
        setCantonQuery(value);
        setSelectedCanton(null);
        setParishQuery("");
        setSelectedParish(null);
        setParroquias([]);

        if (!value || !selectedProvince) {
            setCantones([]);
            return;
        }
        const { data } = await axios.get(route("cantones.buscar"), {
            params: {
                term: value,
                provincia_id: selectedProvince.id, // O lockedProvinceId si no es superadmin
            },
        });
        setCantones(data);
    };

    const selectCanton = (canton) => {
        setSelectedCanton(canton);
        setCantonQuery(canton.nombre);
        setCantones([]);
    };

    //
    // 3) PARROQUIA: se habilita solo si selectedCanton no es null
    //
    const handleParishChange = async (e) => {
        const value = e.target.value;
        setParishQuery(value);
        setSelectedParish(null);

        if (!value || !selectedCanton) {
            setParroquias([]);
            return;
        }
        const { data } = await axios.get(route("parroquias.buscar"), {
            params: {
                term: value,
                canton_id: selectedCanton.id,
            },
        });
        setParroquias(data);
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
        <>
            <AuthenticatedLayout>
                <Head title="Juntas Riego" />
                <div className="max-w-2xl mx-auto mt-8 px-4">
                    <h1 className="text-xl font-bold mb-6">Juntas de Riego</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* PROVINCIA */}
                        <div className="relative">
                            <label className="block font-medium text-sm text-gray-700 mb-1">
                                Provincia
                            </label>

                            {isSuperadmin ? (
                                // SUPERADMIN => input autocomplete
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="border-gray-300 focus:border-indigo-300 focus:ring
                             focus:ring-indigo-200 focus:ring-opacity-50 
                             rounded-md shadow-sm w-full"
                                        value={provinceQuery}
                                        onChange={handleProvinceChange}
                                        placeholder="Escribe una provincia..."
                                    />
                                    {/* Sugerencias */}
                                    {provinces.length > 0 && (
                                        <ul className="absolute bg-white border border-gray-200 mt-1 w-full rounded-md shadow z-10">
                                            {provinces.map((prov) => (
                                                <li
                                                    key={prov.id}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() =>
                                                        selectProvince(prov)
                                                    }
                                                >
                                                    {prov.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ) : (
                                // USUARIO NORMAL => un input "bloqueado" o un simple <span>
                                <input
                                    type="text"
                                    className="border-gray-300 focus:border-indigo-300 focus:ring 
                           focus:ring-indigo-200 focus:ring-opacity-50 
                           rounded-md shadow-sm w-full bg-gray-100"
                                    value={provinceQuery} // locked con la provincia del user
                                    readOnly
                                />
                            )}
                        </div>

                        {/* CANTON */}
                        <div className="relative">
                            <label className="block font-medium text-sm text-gray-700 mb-1">
                                Cantón
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="border-gray-300 focus:border-indigo-300 focus:ring
                           focus:ring-indigo-200 focus:ring-opacity-50 
                           rounded-md shadow-sm w-full disabled:bg-gray-100"
                                    value={cantonQuery}
                                    onChange={handleCantonChange}
                                    placeholder="Escribe un cantón..."
                                    disabled={!selectedProvince} // se habilita solo si hay provincia
                                />
                                {cantones.length > 0 && (
                                    <ul className="absolute bg-white border border-gray-200 mt-1 w-full rounded-md shadow z-10">
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
                            <label className="block font-medium text-sm text-gray-700 mb-1">
                                Parroquia
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="border-gray-300 focus:border-indigo-300 focus:ring
                           focus:ring-indigo-200 focus:ring-opacity-50 
                           rounded-md shadow-sm w-full disabled:bg-gray-100"
                                    value={parishQuery}
                                    onChange={handleParishChange}
                                    placeholder="Escribe una parroquia..."
                                    disabled={!selectedCanton} // se habilita solo si hay cantón
                                />
                                {parroquias.length > 0 && (
                                    <ul className="absolute bg-white border border-gray-200 mt-1 w-full rounded-md shadow z-10">
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

                        {/* BOTON GUARDAR */}
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
            </AuthenticatedLayout>
        </>
    );
};

export default JuntasRiegoIndex;
