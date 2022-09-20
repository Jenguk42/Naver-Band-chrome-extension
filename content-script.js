{
  //// Functions
  // Shuffle the given array
  function shuffle(array) {
    var shuffled = array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
    return shuffled;
  }

  // Stringify the given array
  function stringify(array) {
    var stringArray = "";
    array.forEach((element) => (stringArray += `${element}, `));
    return stringArray.substring(0, stringArray.length - 2);
  }

  // Get member list
  const ulObject = document.querySelector(
    "#content > div > div.memberWrap > div._memberListWrap > div > ul"
  );
  let memberList = [];
  let autoCoupleList = [];
  let noStatusList = [];

  // Loop through members and get the user name
  const numMems = ulObject.childElementCount;

  let autoNumCouples = 0;
  let i = 0;
  while (i < numMems) {
    const username = ulObject.children[i].dataset.user_name;

    // Discard username '.'
    if (username !== ".") {
      const profilemsg = ulObject.children[i].children[1].children[1];

      // All members with or without status are added for now
      memberList.push(username);

      if (typeof (profilemsg) != 'undefined' && profilemsg != null) {
        // A member is a couple if they contain an emoji in their profile msg
        if (/\p{Extended_Pictographic}/u.test(`${profilemsg.innerText}`)) {
          autoCoupleList.push(ulObject.children[i].dataset.user_name);
          autoNumCouples++;
        }
      } else {
        noStatusList.push(ulObject.children[i].dataset.user_name);
      }
    }
    i++;
  }

  // Read data from local storage
  const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (data) {
        if (data[key] === undefined) {
          reject();
        } else {
          resolve(data[key]);
        }
      });
    });
  };

  async function getData() {
    emptyAdded = await readLocalStorage("emptyAdded");
    version = await readLocalStorage("version");
    manualCoupleList = await readLocalStorage("manualCoupleList");
    return [emptyAdded, version, manualCoupleList];
  }
  let data = getData();

  data.then((result) => {
    let emptyAdded = result[0];
    let version = result[1];
    let manualCoupleList = result[2];

    // Check emptyAdded
    if (!emptyAdded) {
      // Members w/o profile msg are not valid
      memberList = memberList.filter((el) => !noStatusList.includes(el));
      autoCoupleList = autoCoupleList.filter((el) => !noStatusList.includes(el));
      console.log('상메 있어야 추가됨')
    } else {
      // Members w/o profile msg are still valid
      console.log('상메 없어도 추가됨')
    }

    // Set solo list according to version
    let soloList = [];
    let manNumCouples = 0;
    let manualCoupleListArr = [];
    if (version === 1) {
      // solo list = member list - couple list
      soloList = memberList.filter((el) => !autoCoupleList.includes(el));
    } else if (version === 2) {
      // retrieve solo list from input
      manualCoupleListArr = manualCoupleList.split(/[\s]*[,][\s]*/);
      soloList = memberList.filter((el) => !manualCoupleListArr.includes(el));
      manNumCouples = memberList.length - soloList.length;
    }

    // console.log('member list', memberList);
    // console.log('couple list', autoCoupleList);
    // console.log('no status list', noStatusList);
    // console.log('solo list', soloList);

    allMembersShuffled = shuffle(memberList);
    soloShuffled = shuffle(soloList);

    console.log(`총 멤버 수: ${memberList.length}`);
    console.log(`자동 감지 커플 수: ${autoNumCouples}`);
    console.log(`자동 감지 커플 목록: ${stringify(autoCoupleList)}`);
    console.log(`입력된 커플 수: ${manNumCouples}`)
    console.log(`입력된 커플 목록: ${stringify(manualCoupleListArr)}`);
    console.log(`커플 제외 멤버 랜덤 태그: ${stringify(soloShuffled)}`);
    console.log(`전체 멤버 랜덤 태그: ${stringify(allMembersShuffled)}`);

    chrome.storage.local.set({
      memberCount: memberList.length,
      autoCoupleCount: autoNumCouples,
      manCoupleCount: manNumCouples,
      autoCoupleList: stringify(autoCoupleList),
      soloRandom: stringify(soloShuffled),
      allRandom: stringify(allMembersShuffled),
    });
  })
}