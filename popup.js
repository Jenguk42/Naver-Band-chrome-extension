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

  // 상메 없는 멤버 확인
  function checkEmptyAdded() {
    if ($("#statusBlank").prop("checked")) {
      chrome.storage.local.set({"emptyAdded": true});
      console.log("상메 없는 멤버 추가됨");
    } else {
      chrome.storage.local.set({"emptyAdded": false});
    }
  }

  // Local storage 초기화
  function clearLocalStorage() {
    chrome.storage.local.set({
      version: 0,
      memberCount: 0,
      autoCoupleCount: 0,
      manCoupleCount: 0,
      autoCoupleList: "",
      manualCoupleList: "",
      soloRandom: "",
      allRandom: "",
      emptyAdded: false
    });
  }

  // Copy text to clipboard
  $('#copy1').click(
    function() {
      $('#output1').select();
      var copy = document.execCommand('copy');
      alert("복사 완료!");
    }
  )
  $('#copy2').click(
    function() {
      $('#output2').select();
      var copy = document.execCommand('copy');
      alert("복사 완료!");
    }
  )
  $('#copy3').click(
    function() {
      $('#V2output1').select();
      var copy = document.execCommand('copy');
      alert("복사 완료!");
    }
  )
  $('#copy4').click(
    function() {
      $('#V2output2').select();
      var copy = document.execCommand('copy');
      alert("복사 완료!");
    }
  )

  // 페이지에서 나가면 저장된 데이터 삭제
  chrome.tabs.onUpdated.addListener(() => {
    clearLocalStorage();
  });

  // 1.0.0: 이모지 커플로 인식
  $("#createShuffleV1").click(
    function() {
      runScriptV1();
      $("#firstClick").hide();
      $("#returnV1").css('display', 'flex');
    });

  $("#newShuffle").click(
    function() {
      runScriptV1();
    });

  // 1.0.0 script
  function runScriptV1() {
    // Add version & emptyAdded
    chrome.storage.local.set({"version": 1});
    checkEmptyAdded();

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
            "autoCoupleCount",
            "autoCoupleList",
            "soloRandom",
            "allRandom",
          ],
          function (data) {
            // Add counts
            if($('#counts')) {
              $("#counts").remove();
            }
            $('#input-container1').after('<div class="input-container" id="counts"></div>');
            $('#counts').append("<b> 총 멤버 수: " + data.memberCount + "<br> 총 커플 수: " + data.autoCoupleCount + "</b>");

            // Output values
            $("#output0").val(data.autoCoupleList);
            $("#output1").val(data.soloRandom);
            $("#output2").val(data.allRandom);
          }
        );
      })
    }
    
  // 2.0.0: 커플 수동 입력
  $("#createShuffleV2").click(
    function() {
      runScriptV2();
      $("#firstClick").hide();
      $("#returnV2").css('display', 'flex');
    });

  $("#runShuffle").click(
    function() {
      runScriptV2();
    });

  // 2.0.0 Script
  function runScriptV2() {
    // Add version, excluded names, and emptyAdded
    chrome.storage.local.set({
      "version": 2,
      "manualCoupleList": $("#manualCoupleList").val(),
    });
    checkEmptyAdded();

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
            "manCoupleCount",
            "soloRandom",
            "allRandom",
          ],
          function (data) {
            // Add counts
            if($('#counts')) {
              $("#counts").remove();
            }
            $('#input-container2').before('<div class="input-container" id="counts"></div>');
            $('#counts').append("<b> 총 멤버 수: " + data.memberCount + "<br> 제외된 멤버 수: " + data.manCoupleCount + "</b>");

            $("#V2output1").val(data.soloRandom);
            $("#V2output2").val(data.allRandom);
          }
        );
      })

  };
});