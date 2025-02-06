import React from "react";
import { Head } from "@inertiajs/react";
import { useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/Components/InputLabel.jsx";
import InputError from "@/Components/InputError.jsx";
import SelectComponent from "@/Components/Select.jsx";
import { createSelectOptionsFormatter } from "../../../utilFunctions/functions";
import {
    isLegalizadaOptions,
    exportFormatOptions,
} from "../../../utilFunctions/dataStructures";

export default function ReportForm({ cantones, tiposRiego, parroquias }) {
    const { data, setData, errors } = useForm({
        canton_id: "",
        parroquia_id: "",
        is_legalizada: "",
        cod_tipo_riego: "",
        fecha_desde: "",
        fecha_hasta: "",
        columns: [],
        export_format: "pdf",
        min_beneficiarios: "",
    });

    // List of possible columns
    const columnsList = [
        { label: "Nº Carpeta", value: "num_carpeta_junta_riego" },
        { label: "Junta de Riego", value: "junta_riego" },
        { label: "Legalizada", value: "is_legalizada" },
        { label: "Tipo de Riego", value: "tipo_riego" },
        { label: "Cantidad Beneficiarios", value: "cantidad_beneficiarios" },
        { label: "Fecha de Resolución", value: "fecha_resolucion" },
        { label: "Nº de Resolución", value: "num_resolucion" },
        { label: "Cantón", value: "canton" },
        { label: "Parroquia", value: "parroquia" },
        {
            label: "Presidente Provisional",
            value: "presidente_provisional",
        },
        {
            label: "Presidente Electo",
            value: "presidente_electo",
        },
        // etc...
    ];

    // toggle column in/out of data.columns
    const toggleColumn = (colValue) => {
        if (data.columns.includes(colValue)) {
            setData(
                "columns",
                data.columns.filter((c) => c !== colValue)
            );
        } else {
            setData("columns", [...data.columns, colValue]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if any fields (columns) are selected
        if (data.columns.length === 0) {
            alert("Por favor, seleccione al menos un campo para el reporte.");
            return; // Stop further execution if no columns are selected
        }

        const query = new URLSearchParams(data).toString();
        const reportUrl = route("juntasRiego.generateReport") + "?" + query;

        // Create an invisible iframe to trigger the file download
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = reportUrl;
        document.body.appendChild(iframe);

        // After starting the download, redirect the main page
        router.visit(route("juntasRiego.index"));
        alert("Reporte generado con exito!. Descargando archivo...");
    };
    // e.preventDefault();
    // // Build query string from form data
    // const query = new URLSearchParams(data).toString();
    // // Redirect the browser to the full URL to trigger a file download
    // window.location.href =
    //     route("juntasRiego.generateReport") + "?" + query;

    // redirectTo(route("juntasRiego"));
    const onChangeHandler = (fieldId) => (event) => {
        setData(fieldId, event.target.value);
    };

    const cantonesOptions = createSelectOptionsFormatter(
        "canton_id",
        "canton"
    )(cantones);

    const parroquiasOptions = createSelectOptionsFormatter(
        "parroquia_id",
        "parroquia"
    )(parroquias);

    const tiposRiegoOptions = createSelectOptionsFormatter(
        "cod_tipo_riego",
        "tipo_riego"
    )(tiposRiego);

    return (
        <AuthenticatedLayout>
            <Head title="Generar Reporte" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="max-w-4xl mx-auto p-4 bg-white ">
                            <h1 className="text-xl font-bold mb-4">
                                Reporte de Juntas
                            </h1>
                            <label className="font-semibold">Filtros</label>
                            <form
                                onSubmit={handleSubmit}
                                method="GET"
                                className="space-y-4"
                            >
                                {/* Canton */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="canton_id"
                                        value={"Cantón"}
                                    />
                                    <SelectComponent
                                        id="canton_id"
                                        name="canton_id"
                                        value={data.canton_id}
                                        onChange={onChangeHandler("canton_id")}
                                        options={cantonesOptions}
                                        placeholder="Elegir una opción"
                                    />
                                    <InputError
                                        message={errors.canton_id}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Parroquia */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="parroquia_id"
                                        value={"Parroquia"}
                                    />
                                    <SelectComponent
                                        id="parroquia_id"
                                        name="parroquia_id"
                                        value={data.parroquia_id}
                                        onChange={onChangeHandler(
                                            "parroquia_id"
                                        )}
                                        options={parroquiasOptions}
                                        placeholder="Elegir una opción"
                                    />
                                    <InputError
                                        message={errors.parroquia_id}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Legalizada */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="is_legalizada"
                                        value={"Legalizada"}
                                    />
                                    <SelectComponent
                                        id="is_legalizada"
                                        name="is_legalizada"
                                        value={data.is_legalizada}
                                        onChange={onChangeHandler(
                                            "is_legalizada"
                                        )}
                                        options={isLegalizadaOptions}
                                        placeholder="Elegir una opción"
                                    />
                                    <InputError
                                        message={errors.is_legalizada}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Tipo de Riego */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="cod_tipo_riego"
                                        value={"Tipo de Riego"}
                                    />
                                    <SelectComponent
                                        id="cod_tipo_riego"
                                        name="cod_tipo_riego"
                                        value={data.cod_tipo_riego}
                                        onChange={onChangeHandler(
                                            "cod_tipo_riego"
                                        )}
                                        options={tiposRiegoOptions}
                                        placeholder="Elegir una opción"
                                    />
                                    <InputError
                                        message={errors.cod_tipo_riego}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Fecha Resolucion Range */}
                                {/* <div className="flex space-x-2">
                                    <div>
                                        <label>Fecha desde</label>
                                        <input
                                            type="date"
                                            className="border rounded p-1"
                                            value={data.fecha_desde}
                                            onChange={(e) =>
                                                setData(
                                                    "fecha_desde",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>Fecha hasta</label>
                                        <input
                                            type="date"
                                            className="border rounded p-1"
                                            value={data.fecha_hasta}
                                            onChange={(e) =>
                                                setData(
                                                    "fecha_hasta",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div> */}

                                {/* Mínimo Beneficiarios */}
                                {/* <div>
                                    <label>Mínimo Beneficiarios</label>
                                    <input
                                        type="number"
                                        className="border rounded p-1"
                                        value={data.min_beneficiarios}
                                        onChange={(e) =>
                                            setData(
                                                "min_beneficiarios",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div> */}

                                {/* Columns to include */}
                                <div>
                                    <label className="font-semibold">
                                        Campos del Reporte
                                    </label>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {columnsList.map((col) => (
                                            <label
                                                key={col.value}
                                                className="inline-flex items-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.columns.includes(
                                                        col.value
                                                    )}
                                                    onChange={() =>
                                                        toggleColumn(col.value)
                                                    }
                                                />
                                                <span className="ml-2">
                                                    {col.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Export format */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="export_format"
                                        value={"Formato"}
                                    />
                                    <SelectComponent
                                        id="export_format"
                                        name="export_format"
                                        value={data.export_format}
                                        onChange={onChangeHandler(
                                            "export_format"
                                        )}
                                        options={exportFormatOptions}
                                        placeholder="Elegir una opción"
                                    />
                                    <InputError
                                        message={errors.export_format}
                                        className="mt-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Generar Reporte
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* <div>
                                    <label>Cantón</label>
                                    <select
                                        className="border rounded p-1"
                                        value={data.canton_id}
                                        onChange={(e) =>
                                            setData("canton_id", e.target.value)
                                        }
                                    >
                                        <option value="">--Todos--</option>
                                        {cantones.map((c) => (
                                            <option
                                                key={c.canton_id}
                                                value={c.canton_id}
                                            >
                                                {c.canton}
                                            </option>
                                        ))}
                                    </select>
                                </div> */

// <div>
//                                     <label>Legalizada</label>
//                                     <select
//                                         className="border rounded p-1"
//                                         value={data.is_legalizada}
//                                         onChange={(e) =>
//                                             setData(
//                                                 "is_legalizada",
//                                                 e.target.value
//                                             )
//                                         }
//                                     >
//                                         <option value="">--Todas--</option>
//                                         <option value="1">Sí</option>
//                                         <option value="0">No</option>
//                                     </select>
//                                 </div>

// <div>
//     <label>Tipo de Riego</label>
//     <select
//         className="border rounded p-1"
//         value={data.cod_tipo_riego}
//         onChange={(e) =>
//             setData(
//                 "cod_tipo_riego",
//                 e.target.value
//             )
//         }
//     >
//         <option value="">--Todos--</option>
//         {tiposRiego.map((tr) => (
//             <option
//                 key={tr.cod_tipo_riego}
//                 value={tr.cod_tipo_riego}
//             >
//                 {tr.tipo_riego}
//             </option>
//         ))}
//     </select>
// </div>

/* <div>
<label>Formato</label>
<select
    className="border rounded p-1"
    value={data.export_format}
    onChange={(e) =>
        setData(
            "export_format",
            e.target.value
        )
    }
>
    <option value="pdf">PDF</option>
    <option value="excel">Excel</option>
</select>
</div> */
