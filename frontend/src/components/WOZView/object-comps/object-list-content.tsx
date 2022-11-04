import {styled, useTheme} from "@mui/material";
import {RecipeObjectStatus} from "./types";
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import {getAbbrLabel} from "./utils";
import Tooltip from '@mui/material/Tooltip';
import Avatar from "@mui/material/Avatar";

interface ObjectListContentProps {
    recipeObjectStatusList: Array<RecipeObjectStatus>
}

const Container = styled("div")({
    flexBasis: 8,
    flexGrow: 8,
    marginTop: 6,

})

export default function ObjectListContent ({recipeObjectStatusList}: ObjectListContentProps){
    let sortedStatusList = [...recipeObjectStatusList].sort((a, b ) => -a.num + b.num)

    const theme = useTheme();
    let renderUnDetectedObjectChip = (recipeObjectStatus, abbrLabel) => {
        return (
            <Tooltip
                key={`detected-obj-${abbrLabel}`}
                title={recipeObjectStatus.object.label}>
                <Chip sx={{
                    marginRight: 1, marginBottom: 1
                }} label={abbrLabel}
                      color={recipeObjectStatus.detected ? "success" : "default"}
                />
            </Tooltip>
        )
    }

    let renderDetectedObject = (recipeObjectStatus, abbrLabel) => {
        return (
            <Tooltip
                key={`undetected-obj-${abbrLabel}`}
                title={recipeObjectStatus.object.label}>
                <Chip sx={{
                    marginRight: 1, marginBottom: 1
                }} label={abbrLabel}
                      avatar={
                          <Avatar sx={{
                              bgcolor: "white"
                              // color: recipeObjectStatus.detected ? theme.palette.success.contrastText: theme.palette.grey[100],
                              // bgcolor: recipeObjectStatus.detected ? theme.palette.success.main: theme.palette.grey[100]
                          }}>{recipeObjectStatus.num}
                          </Avatar>}
                      color={recipeObjectStatus.detected ? "success" : "default"}
                />
            </Tooltip>
        )
    }

    return (
        <Container>
            {
                sortedStatusList.map(recipeObjectStatus => {
                    let abbrLabel = getAbbrLabel(recipeObjectStatus.object);
                    if(recipeObjectStatus.detected){
                        return renderDetectedObject(recipeObjectStatus, abbrLabel)
                    }else{
                        return renderUnDetectedObjectChip(recipeObjectStatus, abbrLabel);
                    }
                }

                )
            }
        </Container>
    )
}