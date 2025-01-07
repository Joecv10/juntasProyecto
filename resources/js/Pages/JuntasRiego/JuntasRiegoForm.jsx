import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, useForm } from "@inertiajs/react";
import axios from "axios";
import { capitalizeEachWord } from "../../../utilFunctions/functions.js";
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import InputError from "@/Components/InputError.jsx";
import SelectComponent from "@/Components/Select.jsx";

const JuntasRiegoIndex = () => {
    const { user } = usePage().props.auth;

    const { cod_oficina_tecnica } = user;

    const { tipo_riego } = usePage().props;

    const { tipo_presidente } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        num_carpeta_junta_riego: "",
        junta_riego: "",
        is_legalizada: "",
        fecha_solicitud: "",
        fecha_resolucion: "",
        num_resolucion: "",
        cantidad_beneficiarios: "",
        cod_tipo_riego: "",
        cod_oficina_tecnica: cod_oficina_tecnica,

        // Presidente provisional
        presidente_provisional: "",
        cedula_presidente_junta_riego_p: "",
        nombres_presidente_junta_riego_p: "",
        email_presidente_junta_riego_p: "",
        telefono_presidente_junta_riego_p: "",
        fecha_nombramiento_presidente_junta_riego_p: "",
        fecha_solicitud_nombramiento_presi_p: "",
        fecha_emision_nombramiento_presi_p: "",

        // Presidente electo
        presidente_electo: "",
        cedula_presidente_junta_riego_e: "",
        nombres_presidente_junta_riego_e: "",
        email_presidente_junta_riego_e: "",
        telefono_presidente_junta_riego_e: "",
    });

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
                // console.log(data);
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
        const formData = {
            ...data,
            provincia: selectedProvince,
            canton: selectedCanton,
            parroquia: selectedParish,
            presidente_provisional: 1,
            presidente_electo: 2,
        };
        console.log("Form Data to be Submitted:", formData);
    };

    const onChangeHandler = (fieldId) => (event) => {
        setData(fieldId, event.target.value);
    };

    // Opciones select
    const isLegalizadaOptions = [
        { value: "1", label: "Sí" },
        { value: "0", label: "No" },
    ];

    const tipoRiego = tipo_riego.map((tipo_riego) => ({
        value: tipo_riego.cod_tipo_riego,
        label: tipo_riego.tipo_riego,
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Juntas Riego" />

            <div className="flex min-h-screen flex-col bg-gray-100 pt-6 sm:pt-0">
                <div className="mb-6 mt-6 w-full max-w-5xl mx-auto overflow-hidden bg-white px-6 py-4 shadow-md sm:rounded-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="p-6 text-gray-900">
                            {`Datos de la Junta de Riego`}
                        </div>
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

                        {/* Número de carpeta */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="num_carpeta_junta_riego"
                                value={"Número de Carpeta"}
                            />
                            <TextInput
                                id="num_carpeta_junta_riego"
                                type="number"
                                name="num_carpeta_junta_riego"
                                value={data.num_carpeta_junta_riego}
                                className="mt-1 block w-full"
                                autoComplete="num_carpeta_junta_riego"
                                onChange={onChangeHandler(
                                    "num_carpeta_junta_riego"
                                )}
                                required
                            />
                            <InputError
                                message={errors.num_carpeta_junta_riego}
                                className="mt-2"
                            />
                        </div>

                        {/* Junta de Riego */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="junta_riego"
                                value={"Junta de Riego"}
                            />
                            <TextInput
                                id="junta_riego"
                                type="text"
                                name="junta_riego"
                                value={capitalizeEachWord(data.junta_riego)}
                                className="mt-1 block w-full"
                                autoComplete="junta_riego"
                                onChange={onChangeHandler("junta_riego")}
                                required
                            />
                            <InputError
                                message={errors.junta_riego}
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
                                onChange={onChangeHandler("is_legalizada")}
                                options={isLegalizadaOptions}
                                placeholder="Elegir una opción"
                                required
                            />
                            <InputError
                                message={errors.is_legalizada}
                                className="mt-2"
                            />
                        </div>

                        {/* fecha solicitud */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="fecha_solicitud"
                                value={"Fecha de Solicitud"}
                            />
                            <TextInput
                                id="fecha_solicitud"
                                type="date"
                                name="fecha_solicitud"
                                value={data.fecha_solicitud}
                                className="mt-1 block w-full"
                                autoComplete="fecha_solicitud"
                                onChange={onChangeHandler("fecha_solicitud")}
                                required
                            />
                            <InputError
                                message={errors.fecha_solicitud}
                                className="mt-2"
                            />
                        </div>

                        {/* fecha resolución */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="fecha_resolucion"
                                value={"Fecha de Resolución"}
                            />
                            <TextInput
                                id="fecha_resolucion"
                                type="date"
                                name="fecha_resolucion"
                                value={data.fecha_resolucion}
                                className="mt-1 block w-full"
                                autoComplete="fecha_resolucion"
                                onChange={onChangeHandler("fecha_resolucion")}
                                required
                            />
                            <InputError
                                message={errors.fecha_resolucion}
                                className="mt-2"
                            />
                        </div>

                        {/* numero de resolucion */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="num_resolucion"
                                value={"Número de Resolución"}
                            />
                            <TextInput
                                id="num_resolucion"
                                type="text"
                                name="num_resolucion"
                                value={data.num_resolucion}
                                className="mt-1 block w-full"
                                autoComplete="num_resolucion"
                                onChange={onChangeHandler("num_resolucion")}
                                required
                            />
                            <InputError
                                message={errors.num_resolucion}
                                className="mt-2"
                            />
                        </div>

                        {/* cantidad de beneficiarios */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="cantidad_beneficiarios"
                                value={"Cantidad de Beneficiarios"}
                            />
                            <TextInput
                                id="cantidad_beneficiarios"
                                type="number"
                                name="cantidad_beneficiarios"
                                value={data.cantidad_beneficiarios}
                                className="mt-1 block w-full"
                                autoComplete="cantidad_beneficiarios"
                                onChange={onChangeHandler(
                                    "cantidad_beneficiarios"
                                )}
                                required
                            />
                            <InputError
                                message={errors.cantidad_beneficiarios}
                                className="mt-2"
                            />
                        </div>

                        {/* tipo de riego */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="cod_tipo_riego"
                                value={"Tipo de Riego"}
                            />
                            <SelectComponent
                                id="cod_tipo_riego"
                                name="cod_tipo_riego"
                                placeholder="Elegir el tipo de riego"
                                value={data.cod_tipo_riego}
                                onChange={onChangeHandler("cod_tipo_riego")}
                                options={tipoRiego}
                                required
                            />
                            <InputError
                                message={errors.cod_tipo_riego}
                                className="mt-2"
                            />
                        </div>

                        <div className="p-6 text-gray-900">
                            {`Datos del Presidente Provisional de la Junta de Riego`}
                        </div>

                        {/* Tipo Presidente */}

                        {/* cedula presidente Provicional */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="cedula_presidente_junta_riego_p"
                                value={"Cédula"}
                            />
                            <TextInput
                                id="cedula_presidente_junta_riego_p"
                                type="text"
                                name="cedula_presidente_junta_riego_p"
                                value={data.cedula_presidente_junta_riego_p}
                                className="mt-1 block w-full"
                                autoComplete="cedula_presidente_junta_riego_p"
                                onChange={onChangeHandler(
                                    "cedula_presidente_junta_riego_p"
                                )}
                                required
                            />
                            <InputError
                                message={errors.cedula_presidente_junta_riego_p}
                                className="mt-2"
                            />
                        </div>

                        {/* nombres presidente Provicional */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="nombres_presidente_junta_riego_p"
                                value={"Nombres"}
                            />
                            <TextInput
                                id="nombres_presidente_junta_riego_p"
                                type="text"
                                name="nombres_presidente_junta_riego_p"
                                value={data.nombres_presidente_junta_riego_p}
                                className="mt-1 block w-full"
                                autoComplete="nombres_presidente_junta_riego_p"
                                onChange={onChangeHandler(
                                    "nombres_presidente_junta_riego_p"
                                )}
                                required
                            />
                            <InputError
                                message={
                                    errors.nombres_presidente_junta_riego_p
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* email presidente provisional */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="email_presidente_junta_riego_p"
                                value={"Correo Electrónico"}
                            />
                            <TextInput
                                id="email_presidente_junta_riego_p"
                                type="email"
                                name="email_presidente_junta_riego_p"
                                value={data.email_presidente_junta_riego_p}
                                className="mt-1 block w-full"
                                autoComplete="email_presidente_junta_riego_p"
                                onChange={onChangeHandler(
                                    "email_presidente_junta_riego_p"
                                )}
                                required
                            />
                            <InputError
                                message={errors.email_presidente_junta_riego_p}
                                className="mt-2"
                            />
                        </div>

                        {/* telefono de contacto presidente provisional */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="telefono_presidente_junta_riego_p"
                                value={"Teléfono de Contacto"}
                            />
                            <TextInput
                                id="telefono_presidente_junta_riego_p"
                                type="text"
                                name="telefono_presidente_junta_riego_p"
                                value={data.telefono_presidente_junta_riego_p}
                                className="mt-1 block w-full"
                                autoComplete="telefono_presidente_junta_riego_p"
                                onChange={onChangeHandler(
                                    "telefono_presidente_junta_riego_p"
                                )}
                                required
                            />
                            <InputError
                                message={
                                    errors.telefono_presidente_junta_riego_p
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* Fecha de solicitud de nombramiento presidente provisional */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="fecha_solicitud_nombramiento_presi_p"
                                value={"Fecha de Emisión de Nombramiento"}
                            />
                            <TextInput
                                id="fecha_solicitud_nombramiento_presi_p"
                                type="date"
                                name="fecha_solicitud_nombramiento_presi_p"
                                value={
                                    data.fecha_solicitud_nombramiento_presi_p
                                }
                                className="mt-1 block w-full"
                                autoComplete="fecha_solicitud_nombramiento_presi_p"
                                onChange={onChangeHandler(
                                    "fecha_solicitud_nombramiento_presi_p"
                                )}
                            />
                            <InputError
                                message={
                                    errors.fecha_solicitud_nombramiento_presi_p
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* Fecha emsion de nombramiento presidente provisional */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="fecha_emision_nombramiento_presi_p"
                                value={"Fecha de Emisión de Nombramiento"}
                            />
                            <TextInput
                                id="fecha_emision_nombramiento_presi_p"
                                type="date"
                                name="fecha_emision_nombramiento_presi_p"
                                value={data.fecha_emision_nombramiento_presi_p}
                                className="mt-1 block w-full"
                                autoComplete="fecha_emision_nombramiento_presi_p"
                                onChange={onChangeHandler(
                                    "fecha_emision_nombramiento_presi_p"
                                )}
                            />
                            <InputError
                                message={
                                    errors.fecha_emision_nombramiento_presi_p
                                }
                                className="mt-2"
                            />
                        </div>

                        <div className="p-6 text-gray-900">
                            {`Datos del Presidente de la Junta de Riego`}
                        </div>

                        {/* Tipo Presidente */}

                        {/* cedula presidente Electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="cedula_presidente_junta_riego_e"
                                value={"Cédula"}
                            />
                            <TextInput
                                id="cedula_presidente_junta_riego_e"
                                type="text"
                                name="cedula_presidente_junta_riego_e"
                                value={data.cedula_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="cedula_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "cedula_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={errors.cedula_presidente_junta_riego_e}
                                className="mt-2"
                            />
                        </div>

                        {/* nombres presidente Electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="nombres_presidente_junta_riego_e"
                                value={"Nombres"}
                            />
                            <TextInput
                                id="nombres_presidente_junta_riego_e"
                                type="text"
                                name="nombres_presidente_junta_riego_e"
                                value={data.nombres_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="nombres_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "nombres_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={
                                    errors.nombres_presidente_junta_riego_e
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* email presidente Electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="email_presidente_junta_riego_e"
                                value={"Correo Electrónico"}
                            />
                            <TextInput
                                id="email_presidente_junta_riego_e"
                                type="email"
                                name="email_presidente_junta_riego_e"
                                value={data.email_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="email_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "email_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={errors.email_presidente_junta_riego_e}
                                className="mt-2"
                            />
                        </div>

                        {/* telefono de contacto presidente electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="telefono_presidente_junta_riego_e"
                                value={"Teléfono de Contacto"}
                            />
                            <TextInput
                                id="telefono_presidente_junta_riego_e"
                                type="text"
                                name="telefono_presidente_junta_riego_e"
                                value={data.telefono_presidente_junta_riego_e}
                                className="mt-1 block w-full"
                                autoComplete="telefono_presidente_junta_riego_e"
                                onChange={onChangeHandler(
                                    "telefono_presidente_junta_riego_e"
                                )}
                                required
                            />
                            <InputError
                                message={
                                    errors.telefono_presidente_junta_riego_e
                                }
                                className="mt-2"
                            />
                        </div>

                        {/* fecha de caducidad de las funciones del presidente electo */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="fecha_caducidad"
                                value={"Fecha de Caducidad"}
                            />
                            <TextInput
                                id="fecha_caducidad"
                                type="date"
                                name="fecha_caducidad"
                                value={data.fecha_caducidad}
                                className="mt-1 block w-full"
                                autoComplete="fecha_caducidad"
                                onChange={onChangeHandler("fecha_caducidad")}
                            />
                            <InputError
                                message={errors.fecha_caducidad}
                                className="mt-2"
                            />
                        </div>

                        {/* BOTÓN GUARDAR */}
                        <div className="mb-6">
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
