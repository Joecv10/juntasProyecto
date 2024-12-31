import { useState } from "react";
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { capitalizeEachWord } from "../../../utilFunctions/functions.js";
import ModalWarning from "@/Components/ModalWarning.jsx";

dayjs.extend(relativeTime);
dayjs.locale("es");

const UsersIndex = ({ listaUsuarios }) => {
    const { auth } = usePage().props;

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Handler for clicking “Delete”
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    // Handler for actually confirming the deletion
    const confirmDelete = () => {
        router.delete(route("users.destroy", userToDelete.id));
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    // Handler for canceling
    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    return (
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow-md sm:rounded-lg">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
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
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                >
                                    Rol
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                >
                                    Creado
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
                            {listaUsuarios && listaUsuarios.length > 0 ? (
                                listaUsuarios.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white dark:bg-gray-800"
                                                : "bg-gray-50 dark:bg-gray-900"
                                        }
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {`${capitalizeEachWord(
                                                user.names
                                            )} ${capitalizeEachWord(
                                                user.last_names
                                            )}`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {capitalizeEachWord(user.role)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {dayjs(user.created_at).fromNow()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {user.id !== auth.user.id &&
                                            user.cod_role !== 1 ? (
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(user)
                                                    }
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            ) : (
                                                <>
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        No hay acción disponible
                                                    </p>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-6 py-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {deleteModalOpen && (
                        <ModalWarning
                            label={
                                "Estás seguro que deseas eliminar al usuario "
                            }
                            confirmDelete={confirmDelete}
                            cancelDelete={cancelDelete}
                            userToDelete={userToDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersIndex;
