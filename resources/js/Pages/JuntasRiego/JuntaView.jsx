import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import { capitalizeEachWord } from "../../../utilFunctions/functions";
import TextAreaInput from "@/Components/TextAreaInput";
import ModalWarning from "@/Components/ModalWarning.jsx";

const JuntaView = ({ juntaRiego, presidenteProv, presidenteJunta }) => {
    const [junta_Riego_single] = juntaRiego;
    const [presidente_provisional] = presidenteProv;

    console.log("Junta Riego", junta_Riego_single);

    // To delete a Junta
    const [deleteJuntaModalOpen, setDeleteJuntaModalOpen] = useState(false);
    const [juntaToDelete, setJuntaToDelete] = useState(null);

    const openDeleteModalJunta = (junta) => {
        setJuntaToDelete(junta);
        setDeleteJuntaModalOpen(true);
    };

    // Handler for actually confirming the deletion
    const confirmDeleteJunta = () => {
        router.delete(
            route("juntasRiego.destroy", juntaToDelete.cod_junta_riego)
        );
        setDeleteJuntaModalOpen(false);
        setJuntaToDelete(null);
    };

    // Handler for canceling
    const cancelDeleteJunta = () => {
        setDeleteJuntaModalOpen(false);
        setJuntaToDelete(null);
    };

    // End to delete a Junta

    // to delete a president
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [presidentToDelete, setPresidentToDelete] = useState(null);

    // Handler for clicking “Delete”
    const openDeleteModal = (president) => {
        setPresidentToDelete(president);
        setDeleteModalOpen(true);
    };

    // Handler for actually confirming the deletion
    const confirmDelete = () => {
        router.delete(
            route(
                "juntasRiego.deletePresident",
                presidentToDelete.cod_presidente_junta_riego
            )
        );
        setDeleteModalOpen(false);
        setPresidentToDelete(null);
    };

    // Handler for canceling
    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setPresidentToDelete(null);
    };
    // End to delete a president

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Junta de riego" />

                {/* View */}
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Button to delete junta */}
                        {/* Add relative positioning to this container */}
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg relative">
                            {/* "Eliminar Junta" button in the top-right */}
                            <button
                                type="button"
                                className="absolute top-0 right-0 mt-4 mr-4 inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                // Replace with your actual delete action handler:
                                onClick={() => {
                                    openDeleteModalJunta(junta_Riego_single);
                                }}
                            >
                                Eliminar Junta
                            </button>
                            {/*  Modal */}
                            {deleteJuntaModalOpen && (
                                <ModalWarning
                                    label={
                                        "Estás seguro que quieres eliminar este registro "
                                    }
                                    confirmDelete={confirmDeleteJunta}
                                    cancelDelete={cancelDeleteJunta}
                                    juntaToDelete={juntaToDelete}
                                />
                            )}
                            {/* End Modal */}
                            {/* End of the button delete layput */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <div className="max-w-4xl mx-auto px-4 py-16">
                                        {/* Main header with decorative underline */}
                                        <div className="mb-16 relative">
                                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                                {junta_Riego_single.junta_riego}
                                            </h1>
                                            <p className="text-lg text-gray-600 mb-6">
                                                {`Número de carpeta: ${junta_Riego_single.num_carpeta_junta_riego}`}
                                            </p>
                                            {/* <div className="absolute bottom-0 left-0 w-24 h-1 bg-blue-500"></div> */}
                                        </div>

                                        {/* New layout */}
                                        {/* Sections: Ubicación, Legalización, and Características */}
                                        <div className="pb-8 border-b-2 border-gray-200">
                                            {/* Flex container for Ubicación and Legalización */}
                                            <div className="flex flex-col md:flex-row md:space-x-8">
                                                {/* Sección de Ubicación */}
                                                <div className="flex-1">
                                                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                                        Ubicación
                                                    </h2>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        {`${capitalizeEachWord(
                                                            junta_Riego_single.direccion_zonal
                                                        )}`}
                                                    </p>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        {`${capitalizeEachWord(
                                                            junta_Riego_single.oficina_tecnica
                                                        )}`}
                                                    </p>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        <strong>
                                                            Provincia:
                                                        </strong>{" "}
                                                        {`${capitalizeEachWord(
                                                            junta_Riego_single.provincia
                                                        )}`}
                                                    </p>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        <strong>Cantón:</strong>{" "}
                                                        {`${capitalizeEachWord(
                                                            junta_Riego_single.canton
                                                        )}`}
                                                    </p>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        <strong>
                                                            Parroquia:
                                                        </strong>
                                                        {` ${capitalizeEachWord(
                                                            junta_Riego_single.parroquia
                                                        )}`}
                                                    </p>
                                                </div>
                                                {/* Sección de Legalización */}
                                                <div className="flex-1 mt-8 md:mt-0">
                                                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                                        Legalización
                                                    </h2>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        <strong>
                                                            Fecha de Solicitud:
                                                        </strong>
                                                        {` ${capitalizeEachWord(
                                                            junta_Riego_single.fecha_solicitud
                                                        )}`}
                                                    </p>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        <strong>
                                                            Fecha de Resolución:
                                                        </strong>
                                                        {` ${capitalizeEachWord(
                                                            junta_Riego_single.fecha_resolucion
                                                        )}`}
                                                    </p>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        <strong>
                                                            Número de
                                                            Resolución:
                                                        </strong>{" "}
                                                        {` ${junta_Riego_single.num_resolucion.toUpperCase()}`}
                                                    </p>
                                                    <p className="text-gray-500 italic text-base leading-relaxed">
                                                        <strong>
                                                            Legalizada:
                                                        </strong>{" "}
                                                        {` ${
                                                            junta_Riego_single.is_legalizada
                                                                ? "Sí"
                                                                : "No"
                                                        }`}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Sección de Características, rendered below with extra spacing */}
                                            <div className="mt-8">
                                                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                                    Características
                                                </h2>
                                                <p className="text-gray-500 italic text-base leading-relaxed">
                                                    <strong>
                                                        Cantidad de
                                                        Beneficiarios:
                                                    </strong>{" "}
                                                    {` ${junta_Riego_single.cantidad_beneficiarios}`}
                                                </p>
                                                <p className="text-gray-500 italic text-base leading-relaxed">
                                                    <strong>
                                                        Tipo de Riego:
                                                    </strong>{" "}
                                                    {` ${capitalizeEachWord(
                                                        junta_Riego_single.tipo_riego
                                                    )}`}
                                                </p>
                                            </div>
                                        </div>
                                        {/* End new layout */}

                                        {/* Presidentes section */}
                                        <div className="space-y-12 mt-12">
                                            {/* Presidente Provisional and Presidente Electo Sections */}
                                            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                                                {/* Presidente Provisional Section */}
                                                {!presidente_provisional ? (
                                                    <>
                                                        <div className="flex-1 relative">
                                                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                                                Presidente
                                                                Provisional
                                                            </h3>
                                                            <p className="text-gray-600 leading-7">
                                                                <strong>
                                                                    No se ha
                                                                    registrado
                                                                    un
                                                                    presidente
                                                                    provisional
                                                                    en esta
                                                                    junta.
                                                                </strong>
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex-1 relative">
                                                        <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                                            Presidente
                                                            Provisional
                                                        </h3>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Cédula:{" "}
                                                            </strong>
                                                            {` ${presidente_provisional.cedula_presidente_junta_riego}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Nombre:{" "}
                                                            </strong>
                                                            {` ${capitalizeEachWord(
                                                                presidente_provisional.nombres_presidente_junta_riego
                                                            )}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Contacto:{" "}
                                                            </strong>
                                                            {` ${presidente_provisional.tel_contacto_presidente_junta_riego}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                E-mail:{" "}
                                                            </strong>
                                                            {` ${presidente_provisional.email_presidente_junta_riego}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Fecha de
                                                                Solicitud de
                                                                Nombramiento:{" "}
                                                            </strong>
                                                            {` ${presidente_provisional.fecha_solicitud_nombramiento}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Fecha de Emisión
                                                                de Nombramiento:{" "}
                                                            </strong>
                                                            {` ${presidente_provisional.fecha_emision_nombramiento}`}
                                                        </p>
                                                        {/* Vertical divider with extra top and bottom spacing */}
                                                        <div className="hidden md:block absolute top-4 bottom-4 -right-12 w-px bg-gray-200"></div>
                                                    </div>
                                                )}

                                                {/* Presidente Electo Section */}
                                                {presidenteJunta.length > 0 ? (
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                                            Presidente Electo
                                                        </h3>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Cédula:{" "}
                                                            </strong>
                                                            {` ${presidenteJunta[0].cedula_presidente_junta_riego}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Nombre:{" "}
                                                            </strong>
                                                            {` ${capitalizeEachWord(
                                                                presidenteJunta[0]
                                                                    .nombres_presidente_junta_riego
                                                            )}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Contacto:{" "}
                                                            </strong>
                                                            {` ${presidenteJunta[0].tel_contacto_presidente_junta_riego}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                E-mail:{" "}
                                                            </strong>
                                                            {` ${presidenteJunta[0].email_presidente_junta_riego}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Fecha de
                                                                Caducidad:{" "}
                                                            </strong>
                                                            {` ${presidenteJunta[0].fecha_caducidad}`}
                                                        </p>
                                                        <p className="text-gray-600 leading-7">
                                                            <strong>
                                                                Observaciones:{" "}
                                                            </strong>
                                                        </p>
                                                        <TextAreaInput
                                                            value={
                                                                presidenteJunta[0]
                                                                    .Observaciones
                                                            }
                                                            readOnly
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                                                Presidente
                                                                Electo
                                                            </h3>
                                                            <p className="text-gray-600 leading-7">
                                                                <strong>
                                                                    No se ha
                                                                    registrado
                                                                    un
                                                                    presidente
                                                                    electo aún
                                                                </strong>
                                                            </p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            {/* Now, outside the flex container, add the button */}
                                            <div className="mt-8 flex justify-end">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                "juntasRiego.presidente",
                                                                junta_Riego_single.cod_junta_riego
                                                            )
                                                        )
                                                    }
                                                >
                                                    Agregar Presidente
                                                </button>
                                            </div>
                                        </div>
                                        {/* End presidentes section */}

                                        {/* Historico presidentes section */}
                                        <div className="pb-8 border-b-2 border-gray-200"></div>
                                        <div className="flex flex-col md:flex-row md:space-x-8 mt-12">
                                            <div className="flex-1">
                                                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                                    Historico Presidentes
                                                </h2>
                                            </div>
                                        </div>
                                        {/* Table presidentes */}
                                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                                <div className="overflow-hidden shadow-md sm:rounded-lg">
                                                    <table className="min-w-full">
                                                        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                                            Presidentes
                                                            Registrados
                                                            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                Lista de
                                                                presidentes
                                                                registrados
                                                            </p>
                                                        </caption>
                                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                                            <tr>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                                >
                                                                    Cédula
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                                >
                                                                    Nombres
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                                >
                                                                    Teléfono
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                                >
                                                                    E-mail
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                                >
                                                                    Fecha de
                                                                    Cucidad
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                                >
                                                                    Observaciones
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                                >
                                                                    Acciones
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {presidenteJunta &&
                                                            presidenteJunta.length >
                                                                0 ? (
                                                                presidenteJunta.map(
                                                                    (
                                                                        presidente,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                presidente.cod_presidente_junta_riego
                                                                            }
                                                                            className={
                                                                                index %
                                                                                    2 ===
                                                                                0
                                                                                    ? "bg-white dark:bg-gray-800"
                                                                                    : "bg-gray-50 dark:bg-gray-900"
                                                                            }
                                                                        >
                                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                                                {
                                                                                    presidente.cedula_presidente_junta_riego
                                                                                }
                                                                            </td>
                                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                                {`${capitalizeEachWord(
                                                                                    presidente.nombres_presidente_junta_riego
                                                                                )}`}
                                                                            </td>
                                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                                {
                                                                                    presidente.tel_contacto_presidente_junta_riego
                                                                                }
                                                                            </td>
                                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                                {
                                                                                    presidente.email_presidente_junta_riego
                                                                                }
                                                                            </td>
                                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                                {
                                                                                    presidente.fecha_caducidad
                                                                                }
                                                                            </td>
                                                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                                {
                                                                                    presidente.Observaciones
                                                                                }
                                                                            </td>
                                                                            <td className="px-6 py-4 text-sm font-medium">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        openDeleteModal(
                                                                                            presidente
                                                                                        )
                                                                                    }
                                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500"
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )
                                                            ) : (
                                                                <tr>
                                                                    <td
                                                                        colSpan="3"
                                                                        className="px-6 py-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400"
                                                                    >
                                                                        No hay
                                                                        presidentes
                                                                        registrados.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                    {deleteModalOpen && (
                                                        <ModalWarning
                                                            label={
                                                                "Estás seguro que quieres eliminar este registro "
                                                            }
                                                            confirmDelete={
                                                                confirmDelete
                                                            }
                                                            cancelDelete={
                                                                cancelDelete
                                                            }
                                                            presidentToDelete={
                                                                presidentToDelete
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* End table presidentes */}

                                        {/* End Historico presidentes section */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default JuntaView;
