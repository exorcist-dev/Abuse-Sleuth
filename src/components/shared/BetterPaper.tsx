import { Paper } from "@mantine/core";

const BetterPaper: React.FC = (props) => {
    return (
        <Paper
            sx={(theme) => ({
                backgroundColor: theme.colors.dark[6],
                width: "auto",
                flexGrow: 1,
            })}
            padding="sm"
        >
            {props.children}
        </Paper>
    );
};

export default BetterPaper;
