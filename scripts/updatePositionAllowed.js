const updatePosition = (corrTextLength, userTextLength, positionLine, prevCheckpoint) => {
    const checkpointDistance = Math.ceil(corrTextLength / 10);
    const currentCheckpoint = Math.floor(userTextLength / checkpointDistance);
    
    const positionLinePart = Math.ceil(parseFloat(positionLine) / 10);

    if (userTextLength % checkpointDistance === 0 && currentCheckpoint > prevCheckpoint) {
        return [true, positionLinePart];
    }

    return [false, null];
};

export default updatePosition;