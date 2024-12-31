import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const JuntasRiegoIndex = () => {
    return (
        <>
            <AuthenticatedLayout>
                <Head title="Juntas de Riego" />
                <h1>Juntas de Riego</h1>
            </AuthenticatedLayout>
        </>
    );
};

export default JuntasRiegoIndex;
