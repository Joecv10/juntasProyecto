import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, useForm, router } from "@inertiajs/react";
// import { Inertia } from "@inertiajs/inertia";
import { capitalizeEachWord } from "../../../utilFunctions/functions.js";

const JuntasRiegoIndex = ({
    listaJuntas,
    cantones,
    parroquias,
    tiposRiego,
    filters,
}) => {
    // 1) Grab the user from Inertia props
    const { user } = usePage().props.auth;

    // 2) Initialize form data from server-provided filters
    const { data, setData } = useForm({
        canton_id: filters?.canton_id || "",
        parroquia_id: filters?.parroquia_id || "",
        is_legalizada: filters?.is_legalizada ?? "",
        cod_tipo_riego: filters?.cod_tipo_riego || "",
        min_beneficiarios: filters?.min_beneficiarios || "",
    });

    // 3) Collapsible states
    const [openCanton, setOpenCanton] = useState(false);
    const [openParroquia, setOpenParroquia] = useState(false);
    const [openLegalizada, setOpenLegalizada] = useState(false);
    const [openTipoRiego, setOpenTipoRiego] = useState(false);
    const [openBenef, setOpenBenef] = useState(false);

    /**
     * Calls router.get(...) to reload the page with new query parameters.
     * `replace: true` avoids adding extra items to browser history on each filter change.
     */
    const applyFilters = (updatedData) => {
        router.get(route("juntasRiego.index"), updatedData, {
            replace: true,
        });
    };

    /**
     * Updates a single filter, then applies them.
     */
    const handleFilterChange = (field, value) => {
        const updatedData = { ...data, [field]: value };
        setData(field, value);
        applyFilters(updatedData);
    };

    /**
     * Clears a single filter (sets it to ""), then applies.
     */
    const clearFilter = (field) => {
        const updatedData = { ...data, [field]: "" };
        setData(field, "");
        applyFilters(updatedData);
    };

    /**
     * Clears ALL filters at once, then applies.
     */
    const clearAllFilters = () => {
        const cleared = {
            canton_id: "",
            parroquia_id: "",
            is_legalizada: "",
            cod_tipo_riego: "",
            min_beneficiarios: "",
        };
        for (const [field, val] of Object.entries(cleared)) {
            setData(field, val);
        }
        applyFilters(cleared);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Juntas de Riego" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* LEFT SIDEBAR: Filters */}
                        <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                Filtros
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Selecciona las opciones para filtrar los
                                resultados
                            </p>

                            {/* Button to clear ALL filters */}
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="mb-4 inline-flex items-center px-3 py-1 text-sm text-white bg-gray-600
                                           hover:bg-gray-700 rounded focus:outline-none focus:ring-2 
                                           focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                            >
                                Limpiar todos los filtros
                            </button>

                            {/* CANTON SECTION (Radio) */}
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenCanton(!openCanton)}
                                    className="flex w-full justify-between items-center text-left focus:outline-none"
                                >
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Cantón
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            openCanton ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openCanton && (
                                    <div className="mt-2 space-y-2">
                                        {cantones.map((c) => (
                                            <label
                                                key={c.canton_id}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name="canton_id"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                    checked={
                                                        data.canton_id ==
                                                        c.canton_id
                                                    }
                                                    onChange={() =>
                                                        handleFilterChange(
                                                            "canton_id",
                                                            c.canton_id
                                                        )
                                                    }
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {c.canton}
                                                </span>
                                            </label>
                                        ))}

                                        {/* Clear canton filter if selected */}
                                        {data.canton_id && (
                                            <button
                                                type="button"
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                                onClick={() =>
                                                    clearFilter("canton_id")
                                                }
                                            >
                                                Quitar filtro de Cantón
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* PARROQUIA SECTION (Radio) */}
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenParroquia(!openParroquia)
                                    }
                                    className="flex w-full justify-between items-center text-left focus:outline-none"
                                >
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Parroquia
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            openParroquia ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openParroquia && (
                                    <div className="mt-2 space-y-2">
                                        {parroquias.map((p) => (
                                            <label
                                                key={p.parroquia_id}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name="parroquia_id"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                    checked={
                                                        data.parroquia_id ==
                                                        p.parroquia_id
                                                    }
                                                    onChange={() =>
                                                        handleFilterChange(
                                                            "parroquia_id",
                                                            p.parroquia_id
                                                        )
                                                    }
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {p.parroquia}
                                                </span>
                                            </label>
                                        ))}

                                        {/* Clear parroquia filter if selected */}
                                        {data.parroquia_id && (
                                            <button
                                                type="button"
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                                onClick={() =>
                                                    clearFilter("parroquia_id")
                                                }
                                            >
                                                Quitar filtro de Parroquia
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* LEGALIZADA SECTION (Radio) */}
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenLegalizada(!openLegalizada)
                                    }
                                    className="flex w-full justify-between items-center text-left focus:outline-none"
                                >
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Legalizada
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            openLegalizada ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openLegalizada && (
                                    <div className="mt-2 space-y-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="is_legalizada"
                                                value="1"
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                checked={
                                                    data.is_legalizada === "1"
                                                }
                                                onChange={() =>
                                                    handleFilterChange(
                                                        "is_legalizada",
                                                        "1"
                                                    )
                                                }
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                Sí
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="is_legalizada"
                                                value="0"
                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                checked={
                                                    data.is_legalizada === "0"
                                                }
                                                onChange={() =>
                                                    handleFilterChange(
                                                        "is_legalizada",
                                                        "0"
                                                    )
                                                }
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                No
                                            </span>
                                        </label>

                                        {/* Clear legalizada filter if selected */}
                                        {data.is_legalizada !== "" && (
                                            <button
                                                type="button"
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                                onClick={() =>
                                                    clearFilter("is_legalizada")
                                                }
                                            >
                                                Quitar filtro de Legalizada
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* TIPO DE RIEGO SECTION (Radio) */}
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenTipoRiego(!openTipoRiego)
                                    }
                                    className="flex w-full justify-between items-center text-left focus:outline-none"
                                >
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Tipo de Riego
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            openTipoRiego ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openTipoRiego && (
                                    <div className="mt-2 space-y-2">
                                        {tiposRiego.map((t) => (
                                            <label
                                                key={t.cod_tipo_riego}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name="cod_tipo_riego"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                                    checked={
                                                        data.cod_tipo_riego ==
                                                        t.cod_tipo_riego
                                                    }
                                                    onChange={() =>
                                                        handleFilterChange(
                                                            "cod_tipo_riego",
                                                            t.cod_tipo_riego
                                                        )
                                                    }
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {t.tipo_riego}
                                                </span>
                                            </label>
                                        ))}

                                        {/* Clear tipo_riego filter if selected */}
                                        {data.cod_tipo_riego && (
                                            <button
                                                type="button"
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                                onClick={() =>
                                                    clearFilter(
                                                        "cod_tipo_riego"
                                                    )
                                                }
                                            >
                                                Quitar filtro de Tipo de Riego
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* MIN BENEFICIARIOS SECTION (Numeric) */}
                            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenBenef(!openBenef)}
                                    className="flex w-full justify-between items-center text-left focus:outline-none"
                                >
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Mínimo de Beneficiarios
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${
                                            openBenef ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openBenef && (
                                    <div className="mt-2 space-y-2">
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: 50"
                                            value={data.min_beneficiarios}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "min_beneficiarios",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {data.min_beneficiarios && (
                                            <button
                                                type="button"
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                                onClick={() =>
                                                    clearFilter(
                                                        "min_beneficiarios"
                                                    )
                                                }
                                            >
                                                Quitar filtro de Beneficiarios
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* RIGHT COLUMN: Table */}
                        <main className="w-full lg:w-3/4">
                            <div className="mb-6">
                                {/* Button Crear junta */}
                                {user.cod_role !== 3 && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white 
                                                   border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-700 
                                                   focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 
                                                   dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                                                   dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                                        onClick={() =>
                                            router.visit(
                                                route("juntasRiego.create")
                                            )
                                        }
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 512 512"
                                        >
                                            <path d="M256,512C114.625,512,0,397.391,0,256C0,114.609,114.625,0,256,0s256,114.609,256,256   C512,397.391,397.391,512,256,512z M288,384h-64v-96h-96v-64h96v-96h64v96h96v64h-96V384z" />
                                        </svg>
                                        Añadir Nueva Junta
                                    </button>
                                )}
                                {/* Button redireccion a form para reportes */}
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white 
                                                   border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-700 
                                                   focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 
                                                   dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                                                   dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                                    onClick={() =>
                                        router.visit(
                                            route("juntasRiego.reportForm")
                                        )
                                    }
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 512 512"
                                    >
                                        <path d="M256,512C114.625,512,0,397.391,0,256C0,114.609,114.625,0,256,0s256,114.609,256,256   C512,397.391,397.391,512,256,512z M288,384h-64v-96h-96v-64h96v-96h64v96h96v64h-96V384z" />
                                    </svg>
                                    Generar Reporte
                                </button>
                                {/* Second button: Go to the Report Form */}
                            </div>

                            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
                                <table className="min-w-full table-fixed">
                                    <caption
                                        className="p-5 text-lg font-semibold text-left text-gray-900 bg-white 
                                                   dark:text-white dark:bg-gray-800"
                                    >
                                        Juntas de Riego
                                        <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                                            Aquí puedes ver una lista de Juntas
                                            de Riego con su información
                                            relevante
                                        </p>
                                    </caption>
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Nº Carpeta
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Junta de Riego
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Provincia
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Cantón
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Parroquia
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Legalizada
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Tipo de Riego
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Beneficiarios
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                F. Solicitud
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                F. Resolución
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Nº Resol.
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaJuntas &&
                                        listaJuntas.length > 0 ? (
                                            listaJuntas.map((junta, index) => (
                                                <tr
                                                    key={junta.cod_junta_riego}
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-white dark:bg-gray-800"
                                                            : "bg-gray-50 dark:bg-gray-900"
                                                    }
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                        {
                                                            junta.num_carpeta_junta_riego
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {capitalizeEachWord(
                                                            junta.junta_riego
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {capitalizeEachWord(
                                                            junta.provincia
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {capitalizeEachWord(
                                                            junta.canton
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {capitalizeEachWord(
                                                            junta.parroquia
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {junta.is_legalizada
                                                            ? "Sí"
                                                            : "No"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {capitalizeEachWord(
                                                            junta.tipo_riego
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {
                                                            junta.cantidad_beneficiarios
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {junta.fecha_solicitud}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {junta.fecha_resolucion}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {junta.num_resolucion}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "juntasRiego.show",
                                                                        junta.cod_junta_riego
                                                                    )
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-500"
                                                        >
                                                            Ver
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="12"
                                                    className="px-6 py-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400"
                                                >
                                                    No se han encontrado
                                                    registros con los parámetros
                                                    establecidos.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default JuntasRiegoIndex;

// const JuntasRiegoIndex = () => {
//     console.log("Props available", usePage().props);
//     const { listaJuntas } = usePage().props;
//     const { user } = usePage().props.auth;

//     return (
//         <>
//             <AuthenticatedLayout>
//                 <Head title="Juntas de Riego" />

//                 <div className="py-12">
//                     <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                         <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                             <div
//                                 className="inline-flex rounded-md shadow-sm"
//                                 role="group"
//                             >
//                                 {user.cod_role !== 3 ? (
//                                     <button
//                                         type="button"
//                                         className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
//                                         onClick={(e) =>
//                                             (window.location.href =
//                                                 "/juntasRiego/create")
//                                         }
//                                     >
//                                         <svg
//                                             className="w-3 h-3 me-2"
//                                             aria-hidden="true"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="currentColor"
//                                             viewBox="0 0 512 512"
//                                         >
//                                             <path d="M256,512C114.625,512,0,397.391,0,256C0,114.609,114.625,0,256,0c141.391,0,256,114.609,256,256  C512,397.391,397.391,512,256,512z M256,64C149.969,64,64,149.969,64,256s85.969,192,192,192c106.047,0,192-85.969,192-192  S362.047,64,256,64z M288,384h-64v-96h-96v-64h96v-96h64v96h96v64h-96V384z" />
//                                         </svg>
//                                         Añadir Nueva Junta
//                                     </button>
//                                 ) : (
//                                     <></>
//                                 )}
//                             </div>

//                             {/* <div className="p-6 text-gray-900"></div> */}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="py-12">
//                     <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                         <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                             <div className="p-6 text-gray-900">
//                                 {/* Your content goes here */}
//                                 <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
//                                     <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
//                                         <div className="overflow-hidden shadow-md sm:rounded-lg">
//                                             {/* Inicio tabla */}
//                                             {/* Fin Tabla */}
//                                             <table className="min-w-full table-fixed">
//                                                 <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
//                                                     Juntas de Riego
//                                                     <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
//                                                         Aquí puedes ver una
//                                                         lista de Juntas de Riego
//                                                         con su información
//                                                         relevante
//                                                     </p>
//                                                 </caption>
//                                                 <thead className="bg-gray-50 dark:bg-gray-700">
//                                                     <tr>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Número de Carpeta
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Junta de Riego Y/O
//                                                             Drenaje
//                                                         </th>
//                                                         {/* <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Dirección Zonal
//                                                         </th> */}
//                                                         {/* <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Oficina Técnica
//                                                         </th> */}
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Provincia
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Cantón
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Parrquia
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Legalizada Sí/No
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Tipo de Riego
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Cantidad de
//                                                             Beneficiarios
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Fecha de Solicitud
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Fecha de Resolución
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Número de Resolución
//                                                         </th>
//                                                         <th
//                                                             scope="col"
//                                                             className="px-6 py-4 w-[7%] text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
//                                                         >
//                                                             Acciones
//                                                         </th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {listaJuntas &&
//                                                     listaJuntas.length > 0 ? (
//                                                         listaJuntas.map(
//                                                             (junta, index) => (
//                                                                 <tr
//                                                                     key={
//                                                                         junta.cod_junta_riego
//                                                                     }
//                                                                     className={
//                                                                         index %
//                                                                             2 ===
//                                                                         0
//                                                                             ? "bg-white dark:bg-gray-800"
//                                                                             : "bg-gray-50 dark:bg-gray-900"
//                                                                     }
//                                                                 >
//                                                                     <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
//                                                                         {`${junta.num_carpeta_junta_riego}`}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {capitalizeEachWord(
//                                                                             junta.junta_riego
//                                                                         )}
//                                                                     </td>
//                                                                     {/* <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {capitalizeEachWord(
//                                                                             junta.direccion_zonal
//                                                                         )}
//                                                                     </td> */}
//                                                                     {/* <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {capitalizeEachWord(
//                                                                             junta.oficina_tecnica
//                                                                         )}
//                                                                     </td> */}
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {capitalizeEachWord(
//                                                                             junta.provincia
//                                                                         )}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {capitalizeEachWord(
//                                                                             junta.canton
//                                                                         )}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {capitalizeEachWord(
//                                                                             junta.parroquia
//                                                                         )}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {junta.is_legalizada
//                                                                             ? "Sí"
//                                                                             : "No"}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {capitalizeEachWord(
//                                                                             junta.tipo_riego
//                                                                         )}
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {
//                                                                             junta.cantidad_beneficiarios
//                                                                         }
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {
//                                                                             junta.fecha_solicitud
//                                                                         }
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {
//                                                                             junta.fecha_resolucion
//                                                                         }
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
//                                                                         {
//                                                                             junta.num_resolucion
//                                                                         }
//                                                                     </td>
//                                                                     <td className="px-6 py-4 text-sm font-medium">
//                                                                         {
//                                                                             <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-500">
//                                                                                 Ver
//                                                                                 Junta
//                                                                             </button>
//                                                                         }
//                                                                     </td>
//                                                                 </tr>
//                                                             )
//                                                         )
//                                                     ) : (
//                                                         <tr>
//                                                             <td
//                                                                 colSpan="3"
//                                                                 className="px-6 py-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400"
//                                                             >
//                                                                 No users found.
//                                                             </td>
//                                                         </tr>
//                                                     )}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </AuthenticatedLayout>
//         </>
//     );
// };
