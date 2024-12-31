import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import UsersIndex from "./Users/UsersIndex";
import { usePage } from "@inertiajs/react";
import { capitalizeEachWord } from "./../../utilFunctions/functions.js";

export default function Dashboard({ listaUsuarios }) {
    const { auth } = usePage().props;
    const user = auth.user;
    let arrayNombres = user.names.split(" ");
    const oficinaTecnica = listaUsuarios.find(
        (usuario) => usuario.id === user.id
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {`${capitalizeEachWord(oficinaTecnica.oficina_tecnica)}`}
                </h2>
            }
        >
            <Head title="Inicio" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {`Hola, ${capitalizeEachWord(arrayNombres[0])} 👋🏽`}
                        </div>
                    </div>
                </div>
            </div>
            {user.cod_role === 1 ? (
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <UsersIndex listaUsuarios={listaUsuarios} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </AuthenticatedLayout>
    );
}
