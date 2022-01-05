$(document).ready(function () {
  let tabId;

  // 밴드 멤버 페이지에서만 실행
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const regex = /https:\/\/band.us\/band\/[0-9]{8}\/member/gm;
    const isBand = tabs[0].url.match(regex);
    tabId = tabs[0].id;

    if (!isBand) {
      $("#alertNotOnBand").show();
      $("#onBand").hide();
    } else {
      $("#onBand").show();
      $("#alertNotOnBand").hide();
    }
  });

  // 페이지에서 나가면 저장된 데이터 삭제
  chrome.tabs.onUpdated.addListener(() => {
    chrome.storage.local.set({
      memberCount: 0,
      coupleCount: 0,
      coupleList: "",
      soloRandom: "",
      allRandom: "",
    });
  });
    
  function runScript() {
  // 제외할 이름 저장
  // chrome.storage.local.set(
  //   {
  //     excludedNames: $("#excludedNames").val(),
  //   },
  //   function () {
  //     console.log(`${excludedNames.value} excluded`);
  //   }
  // );

  // Execute content script
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ["content-script.js"],
    },
    () => {
      // Get the stored values
      chrome.storage.local.get(
        [
          "memberCount",
          "coupleCount",
          "coupleList",
          "soloRandom",
          "allRandom",
        ],
        function (data) {
          $("#output0").text(
            `총 멤버 수: ${data.memberCount} / 총 커플 수: ${data.coupleCount}`
          );
          $("#output0").val(data.coupleList);
          $("#output1").val(data.soloRandom);
          $("#output2").val(data.allRandom);
        }
      );
      console.log("output1 length is: " + $("#output1").val().length);
    }
  )}

  $("#createShuffle").click(
    function() {
      runScript();
      $("#return").css('display', 'flex');
      $("#firstClick").hide();
    });

  $("#newShuffle").click(
    function() {
      runScript();
    });

  
});