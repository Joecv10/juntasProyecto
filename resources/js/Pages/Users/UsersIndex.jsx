import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const UsersIndex = ({ listaUsuarios }) => {
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
                                    Name
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
                                    Actions
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
                                            {`${user.names} ${user.last_names}`}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {user.role === "superadmin"
                                                ? "Super Administrador"
                                                : user.role === "admin"
                                                ? "Administrador"
                                                : "Visitante"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {dayjs(user.created_at).fromNow()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-500">
                                                Edit
                                            </button>{" "}
                                            |{" "}
                                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-500">
                                                Delete
                                            </button>
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
                </div>
            </div>
        </div>
    );
};

export default UsersIndex;
