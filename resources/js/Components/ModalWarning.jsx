const ModalWarning = ({ label, userToDelete, confirmDelete, cancelDelete }) => {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40">
                <div className="bg-white p-4 rounded shadow-md">
                    <h2 className="text-xl mb-4">
                        {label}
                        <strong>
                            {" "}
                            {userToDelete?.names} {userToDelete?.last_names}
                        </strong>
                        ?
                    </h2>
                    <div className="flex justify-end space-x-2">
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            onClick={confirmDelete}
                        >
                            Eliminar
                        </button>
                        <button
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={cancelDelete}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalWarning;
