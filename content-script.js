{
  let excludedNames;
  // // Names to remove
  // chrome.storage.local.get(["excludedNames"], function (result) {
  //   excludedNames = result.excludedNames;
  //   console.log("Value currently is " + result.excludedNames);
  // });
  // console.log(excludedNames);

  // Get member list
  const ulObject = document.querySelector(
    "#content > div > div.memberWrap > div._memberListWrap > div > ul"
  );
  let memberList = [];
  let coupleList = [];
  let soloList = [];

  // Loop through members and get the user name
  const numMems = ulObject.childElementCount;

  let numCouples = 0;
  let i = 0;
  while (i < numMems) {
    const username = ulObject.children[i].dataset.user_name;

    //Discard username '.'
    if (username !== ".") {

      // Get profile message to check if it contains emoji
      // WARNING: a member is only valid if they have a profile msg
      // A member is a couple if they contain an emoji in their profile msg

      const profilemsg = ulObject.children[i].children[1].children[1];

      if (typeof(profilemsg) != 'undefined' && profilemsg != null) {
        memberList.push(username);
        
        if (/\p{Extended_Pictographic}/u.test(`${profilemsg.innerText}`)) {
          coupleList.push(ulObject.children[i].dataset.user_name);
          numCouples++;
        } else {
          soloList.push(ulObject.children[i].dataset.user_name);
        }
      }
    }

    i++;
  }

  // Shuffle the array
  function shuffle(array) {
    var shuffled = array
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);

    return shuffled;
  }

  // Stringify the array
  function stringify(array) {
    var stringArray = "";
    array.forEach((element) => (stringArray += `${element}, `));

    return stringArray.substring(0, stringArray.length - 2);
  }

  allMembersShuffled = shuffle(memberList);
  soloShuffled = shuffle(soloList);

  console.log(`총 멤버 수: ${memberList.length}`);
  console.log(`총 커플 수: ${numCouples}`);
  console.log(`커플 목록: ${stringify(coupleList)}`);
  console.log(`커플 제외 멤버 랜덤 태그: ${stringify(soloShuffled)}`);
  console.log(`전체 멤버 랜덤 태그: ${stringify(allMembersShuffled)}`);

  chrome.storage.local.set({
    memberCount: memberList.length,
    coupleCount: numCouples,
    coupleList: stringify(coupleList),
    soloRandom: stringify(soloShuffled),
    allRandom: stringify(allMembersShuffled),
  });
}