import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import UsersIndex from "./Users/UsersIndex";
import { usePage } from "@inertiajs/react";

export default function Dashboard({ listaUsuarios }) {
    const { auth } = usePage().props;
    const user = auth.user;

    console.log("Authenticated User:", user);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
            {user.role === "superadmin" ? (
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
