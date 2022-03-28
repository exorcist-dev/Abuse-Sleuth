import { GetServerSideProps } from "next";

import { Box, Container, Group, Title } from "@abuse-sleuth/ui";

import DashboardLayout from "@layouts/DashboardLayout";
import DefaultLayout from "@layouts/DefaultLayout";

export default function UserIndex() {
    return (
        <DashboardLayout>
            <Title>User</Title>
        </DashboardLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
