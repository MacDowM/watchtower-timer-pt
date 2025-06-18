javascript:
if (document.URL.match("mode=incomings&subtype=attacks")) {
    $("#incomings_table").find("tr").eq(0).find("th").last().after('<th>Watchtower</th>');
    var url = "https://" + location.host + game_data.link_base_pure + "overview_villages&mode=buildings&group=0&page=-1",
        url2 = "https://" + location.host + "/interface.php?func=get_unit_info",
        towerCoords = [],
        towerLevels = [],
        unitSpeed = [],
        intersectionPoints = [],
        block = [],
        timesRun = 1,
        rows = Number($("#incomings_table").find("th").first().text().split(" ")[1].replace("(", "").replace(")", ""));

    function first() {
        $.ajax({
            url: url2,
            async: false,
            success: function(data) {
                $.each(["sword", "axe", "spy", "light", "heavy", "ram", "snob"], function(key, val) {
                    unitSpeed.push(Number($(data).find("config > " + val + " > speed").text()) * 60);
                })
                $.ajax({
                    url: url,
                    async: false,
                    success: function(datas) {
                        $(datas).find("#villages").find("tr").each(function(key, val) {
                            if (Number($(val).find(".upgrade_building.b_watchtower").text()) > 0) {
                                towerCoords.push($(val).find(".quickedit-label").text().match(/\d+\|\d+/)[0]);
                                var level = Number($(val).find(".upgrade_building.b_watchtower").text());
                                switch (level) {
                                    case 1: towerLevels.push(1.1); break;
                                    case 2: towerLevels.push(1.3); break;
                                    case 3: towerLevels.push(1.5); break;
                                    case 4: towerLevels.push(1.7); break;
                                    case 5: towerLevels.push(2); break;
                                    case 6: towerLevels.push(2.3); break;
                                    case 7: towerLevels.push(2.6); break;
                                    case 8: towerLevels.push(3); break;
                                    case 9: towerLevels.push(3.4); break;
                                    case 10: towerLevels.push(3.9); break;
                                    case 11: towerLevels.push(4.4); break;
                                    case 12: towerLevels.push(5.1); break;
                                    case 13: towerLevels.push(5.8); break;
                                    case 14: towerLevels.push(6.7); break;
                                    case 15: towerLevels.push(7.6); break;
                                    case 16: towerLevels.push(8.7); break;
                                    case 17: towerLevels.push(10); break;
                                    case 18: towerLevels.push(11.5); break;
                                    case 19: towerLevels.push(13.1); break;
                                    case 20: towerLevels.push(15); break;
                                }
                            }
                        })
                        if (towerCoords.length == 0) {
                            UI.ErrorMessage("There are no watchtowers in any of your villages!", 5000)
                        }
                    },
                })
            },
        })
    }

    var doStuff = function() {
        intersectionPoints = [];
        block = [];
        $("#incomings_table").find("tr").eq(timesRun).find("td").last().after("<td></td>");
        var distance = Number($("#incomings_table").find("tr").eq(timesRun).find("td").eq(4).text().trim());
        var destination = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(1).text().match(/\d+\|\d+/)[0];
        var origin = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(2).text().match(/\d+\|\d+/)[0];
        var hms = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(6).text().split(':'),
            seconds = (+hms[0]) * 3600 + (+hms[1]) * 60 + (+hms[2]),
            commandName = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(0).text().trim().toLowerCase();

        var remainingFields;
        var translatedUnit = "";

        if (commandName.includes("sword")) {
            remainingFields = seconds / unitSpeed[0];
            translatedUnit = "Espadachim";
        } else if (commandName.includes("axe")) {
            remainingFields = seconds / unitSpeed[1];
            translatedUnit = "Bárbaro";
        } else if (commandName.includes("spear")) {
            remainingFields = seconds / unitSpeed[1];
            translatedUnit = "Lanceiro";
        } else if (commandName.includes("spy") || commandName.includes("scout")) {
            remainingFields = seconds / unitSpeed[2];
            translatedUnit = "Explorador";
        } else if (commandName.includes("light") || commandName.includes("lcav")) {
            remainingFields = seconds / unitSpeed[3];
            translatedUnit = "Cavalaria leve";
        } else if (commandName.includes("heavy") || commandName.includes("hcav")) {
            remainingFields = seconds / unitSpeed[4];
            translatedUnit = "Cavalaria pesada";
        } else if (commandName.includes("ram") || commandName.includes("cat")) {
            remainingFields = seconds / unitSpeed[5];
            translatedUnit = "Aríete/Catapulta";
        } else if (commandName.includes("noble") || commandName.includes("snob")) {
            remainingFields = seconds / unitSpeed[6];
            translatedUnit = "Nobre";
        }

        var target = String(destination).split("|");
        var source = String(origin).split("|");
        var divisor = Number(target[0]) - Number(source[0]);
        if (divisor == 0) divisor = 1;
        var m = (Number(target[1]) - Number(source[1])) / (divisor);
        var n = (m * Number(target[0]) - Number(target[1])) / -1;

        for (var i = 0; i < towerCoords.length; i++) {
            var h = (String(towerCoords[i]).split("|"))[0];
            var k = (String(towerCoords[i]).split("|"))[1];
            var r = towerLevels[i];
            findCircleLineIntersections(r, h, k, m, n);
        }

        function findCircleLineIntersections(r, h, k, m, n) {
            var a = 1 + Math.pow(m, 2);
            var b = -h * 2 + (m * (n - k)) * 2;
            var c = Math.pow(h, 2) + Math.pow(n - k, 2) - Math.pow(r, 2);
            var d = Math.pow(b, 2) - 4 * a * c;
            if (d >= 0) {
                var intersections = [
                    (-b + Math.sqrt(d)) / 2 / a,
                    (-b - Math.sqrt(d)) / 2 / a
                ];
                intersectionPoints.push(intersections[0] + "|" + (m * intersections[0] + n));
                intersectionPoints.push(intersections[1] + "|" + (m * intersections[1] + n));
            }
        }

        if (intersectionPoints.length == 0) {
            $("#incomings_table").find("tr").eq(timesRun).find("td").last().html(translatedUnit + "<br><span style='color:red;font-weight:bold'>Indetetável</span>");
            ++timesRun
            setTimeout(doStuff, 1);
            return;
        }

        for (var i = 0; i < intersectionPoints.length; i++) {
            var intersections = intersectionPoints[i].split("|");
            var originDistance = Math.sqrt((Math.pow((intersections[0] - source[0]), 2) + Math.pow((intersections[1] - source[1]), 2)));
            block.push(originDistance);
        }

        idx = block.indexOf(Math.min.apply(null, block));
        var nearest = intersectionPoints[idx];
        var currentDistance = distance - remainingFields;
        var M = nearest.split("|");
        var remaining = Math.sqrt((Math.pow((M[0] - source[0]), 2) + Math.pow((M[1] - source[1]), 2))) - currentDistance;

        var sec;
        if (commandName.includes("sword")) {
            sec = remaining * unitSpeed[0];
        } else if (commandName.includes("axe") || commandName.includes("spear")) {
            sec = remaining * unitSpeed[1];
        } else if (commandName.includes("spy") || commandName.includes("scout")) {
            sec = remaining * unitSpeed[2];
        } else if (commandName.includes("light") || commandName.includes("lcav")) {
            sec = remaining * unitSpeed[3];
        } else if (commandName.includes("heavy") || commandName.includes("hcav")) {
            sec = remaining * unitSpeed[4];
        } else if (commandName.includes("ram") || commandName.includes("cat")) {
            sec = remaining * unitSpeed[5];
        } else if (commandName.includes("noble") || commandName.includes("snob")) {
            sec = remaining * unitSpeed[6];
        }

        function clock(x) {
            var myTimer = setInterval(function() {
                --sec;
                var seconds = Math.floor(sec % 60);
                var minutes = Math.floor((sec / 60) % 60);
                var hours = Math.floor((sec / (60 * 60)));
                seconds = seconds < 10 ? "0" + seconds : seconds;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                hours = hours < 10 ? "0" + hours : hours;
                if (sec < 0) {
                    $("#incomings_table").find("tr").eq(x).find("td").last().html(translatedUnit + "<br><span style='color:green;font-weight:bold'>Detectado</span>");
                } else {
                    $("#incomings_table").find("tr").eq(x).find("td").last().html(translatedUnit + "<br>" + hours + ":" + minutes + ":" + seconds).css("font-weight", "bold");
                }
                if (sec <= 0) {
                    clearInterval(myTimer);
                }
            }, 1000);
        }

        clock(timesRun);
        if (++timesRun < rows + 1) {
            doStuff();
        }
    }

    $.ajax({
        url: url,
        success: function() {
            first();
            doStuff();
        }
    });

} else {
    self.location = game_data.link_base_pure.replace(/screen\=\w*/i, "screen=overview_villages&mode=incomings&subtype=attacks");
}
void(0);
