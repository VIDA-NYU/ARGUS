import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { CodeBlock, prettyJSON, StreamView } from './LiveStream';

export const LogsView = ({ streamId, formatter=prettyJSON, ...rest }) => {
    return <StreamView streamId={streamId} utf formatter={data => <CodeBlock>{formatter(data)}</CodeBlock>} {...rest} />
}