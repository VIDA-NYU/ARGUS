// templates
import AccordionView from '../../templates/AccordionView/AccordionView';

// material
import {Box, styled} from '@mui/material';

// temp
import JSONPretty from 'react-json-pretty';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import {HandsCanvas} from "./hand-data-vis/canvas";

const Container = styled("div")(({}) => ({
    display: "flex",
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
}))

const JsonDataContainer = styled(Card)(({}) => ({
    height: "100%",
    width: "600px",
    marginLeft: 30,
}))

const JsonContent = styled("div")(({}) => ({
    overflowY: "scroll",
    height: "100%",
    position: "relative",
    left: 0
}))


const HandsDataView = ({ type, title, data, recordingName, state, onProgress, onSeek }: any) => {
  
  return (
    <AccordionView title='Hands Data' height={300}>
      <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'auto' }}>
          <Container>
              <Card>
                  <CardHeader
                      titleTypographyProps={{
                          fontSize: 16,
                      }}
                      title={"Overview"}></CardHeader>
                  <CardContent>
                      <HandsCanvas state={state} variant={"overview"}  data={data}/>
                  </CardContent>
              </Card>
              <Card
                  sx={{
                      marginLeft: 10,
                      marginRight: 10
                  }}
              >
                  <CardHeader
                      titleTypographyProps={{
                          fontSize: 16,
                      }}
                      title={"Left Hand"}></CardHeader>
                  <CardContent>
                      <HandsCanvas state={state} variant={"left"}  data={data}/>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader
                      titleTypographyProps={{
                          fontSize: 16,
                      }}
                      title={"Right Hand"}></CardHeader>
                  <CardContent>
                      <HandsCanvas state={state} variant={"right"} data={data}/>
                  </CardContent>
              </Card>
              <JsonDataContainer>
                  <CardHeader
                      titleTypographyProps={{
                          fontSize: 16,
                      }}
                      title={"JSON"}></CardHeader>
                  <JsonContent>
                      <JSONPretty id="json-pretty" data={data}></JSONPretty>
                  </JsonContent>
              </JsonDataContainer>

          </Container>

      </Box>
    </AccordionView>
  )
}

export default HandsDataView;