import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

import { requireAuth } from "@abuse-sleuth/authentication/nextjs";
import { trpcClient } from "@abuse-sleuth/trpc/nextjs/client";
import {
    Button,
    Divider,
    Group,
    Icon,
    Loader,
    Skeleton,
    Stack,
    Text,
    Title,
} from "@abuse-sleuth/ui/components/atoms";
import {
    IconEdit,
    IconExclamationMark,
    IconLock,
    IconPlus,
} from "@abuse-sleuth/ui/icons";

import { openTeamAddMemberModal } from "@components/dashboard/features/modals/TeamAddMemberModal";
import { openTeamEditModal } from "@components/dashboard/features/modals/TeamEditModal";
import { Layout } from "@components/dashboard/layouts";
import MembersTable from "@components/teams/features/MembersTable";

const TeamViewSingle: NextPage = () => {
    const router = useRouter();
    const teamId = router.query.teamid as string;

    const getTeamQuery = trpcClient.teams.get.useQuery({
        teamId,
    });

    const getTeamMembersQuery = trpcClient.teams.members.getMembers.useQuery({
        teamId,
    });

    //  TODO: Improve this, Make it Centralised
    if (getTeamQuery.isLoading || getTeamMembersQuery.isLoading) {
        return (
            <Layout>
                <Group
                    position="center"
                    sx={() => ({
                        height: "100vh",
                    })}>
                    <Loader size={"xl"} color="violet" />
                </Group>
            </Layout>
        );
    }

    // TODO: Improve this, Make it Centralised
    if (
        getTeamQuery.isError ||
        !getTeamQuery.data ||
        getTeamMembersQuery.isError ||
        !getTeamMembersQuery.data
    ) {
        return (
            <Layout>
                <Group
                    position="center"
                    sx={() => ({
                        height: "100vh",
                    })}>
                    <Stack spacing={"xs"} align={"center"}>
                        <Icon
                            icon={<IconExclamationMark />}
                            color={"red"}
                            size={56}
                            stroke={3}
                        />
                        <Title>Error has Occurred</Title>
                        <Text>
                            Error:{" "}
                            {getTeamQuery.error?.message ||
                                getTeamMembersQuery.error?.message}
                        </Text>
                        <Text color={"dimmed"} size="xs">
                            Check the Console, if you are tech-savvy...
                        </Text>
                    </Stack>
                </Group>
            </Layout>
        );
    }

    return (
        <Layout>
            <Group position="apart">
                <Title>
                    {getTeamQuery.data.teamName ?? <Skeleton width={45} />}
                </Title>
                <Button
                    color="violet"
                    variant="light"
                    leftIcon={
                        getTeamQuery.data.locked ? (
                            <IconLock size="16px" />
                        ) : (
                            <IconEdit size="16px" />
                        )
                    }
                    disabled={getTeamQuery.data.locked}
                    onClick={() => openTeamEditModal({ teamId })}>
                    Edit Team
                </Button>
            </Group>
            <Divider my="md" />
            <Stack spacing={"xs"}>
                <Group position="apart">
                    <Title>Members</Title>

                    <Button
                        color="green"
                        variant="light"
                        leftIcon={<IconPlus size={16} />}
                        disabled={getTeamQuery.data.locked}
                        onClick={() => openTeamAddMemberModal({ teamId })}>
                        Add User
                    </Button>
                </Group>
                <MembersTable teamId={teamId} />
            </Stack>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = requireAuth();

export default TeamViewSingle;
