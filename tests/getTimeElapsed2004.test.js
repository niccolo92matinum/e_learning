import { expect, it } from 'vitest'
import { getTimeElapsed2004 } from "../src/utils/react-scorm-provider/ScormProvider.jsx";

it('getTimeElapsed2004', () => {
    let sessionStartDateTime = 1719492212790;
    const formattedSessionTime = getTimeElapsed2004(sessionStartDateTime);
    expect(formattedSessionTime).toBe("P19901530DT5H28658203546M30S");
})
