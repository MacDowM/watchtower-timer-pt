javascript:
        if (document.URL.match("mode=incomings&subtype=attacks")) {
                $("#incomings_table").find("tr").eq(0).find("th").last().after('<th>Torre de Vigia</th>');
                var url = "https://" + location.host + game_data.link_base_pure + "overview_villages&mode=buildings&group=0&page=-1",
                        url2 = "https://" + location.host + "/interface.php?func=get_unit_info",
                        towerCoords = [],
                        towerLevels = [],
                        unitSpeed = [],
                        intersectionPoints = [],
                        block = [],
                        timesRun = 1,
                        //pega o número de ataques entre parênteses no topo da tabela
                        rows = Number($("#incomings_table").find("th").first().text().split(" ")[1].replace("(", "").replace(")", ""));
 
 
                function first() {
                        $.ajax({
                                url: url2,
                                async: false,
                                success: function(data) {
                                        $.each(["sword", "axe", "spy", "light", "heavy", "ram", "snob"], function(key, val) {
                                                // extrai velocidades das unidades
                                                unitSpeed.push(Number($(data).find("config > " + val + " > speed").text()) * 60);
                                        })
                                        $.ajax({
                                                url: url,
                                                async: false,
                                                success: function(datas) {
                                                        $(datas).find("#villages").find("tr").each(function(key, val) {
                                                                if (Number($(val).find(".upgrade_building.b_watchtower").text()) > 0) {
                                                                        // extrai coordenadas e níveis das torres de vigia
                                                                        towerCoords.push($(val).find(".quickedit-label").text().match(/\d+\|\d+/)[0]);
                                                                        // raio da torre de vigia
                                                                        var level = Number($(val).find(".upgrade_building.b_watchtower").text());
                                                                        switch (level) {
                                                                                case 1:
                                                                                        towerLevels.push(1.1);
                                                                                        break;
                                                                                case 2:
                                                                                        towerLevels.push(1.3);
                                                                                        break;
                                                                                case 3:
                                                                                        towerLevels.push(1.5);
                                                                                        break;
                                                                                case 4:
                                                                                        towerLevels.push(1.7);
                                                                                        break;
                                                                                case 5:
                                                                                        towerLevels.push(2);
                                                                                        break;
                                                                                case 6:
                                                                                        towerLevels.push(2.3);
                                                                                        break;
                                                                                case 7:
                                                                                        towerLevels.push(2.6);
                                                                                        break;
                                                                                case 8:
                                                                                        towerLevels.push(3);
                                                                                        break;
                                                                                case 9:
                                                                                        towerLevels.push(3.4);
                                                                                        break;
                                                                                case 10:
                                                                                        towerLevels.push(3.9);
                                                                                        break;
                                                                                case 11:
                                                                                        towerLevels.push(4.4);
                                                                                        break;
                                                                                case 12:
                                                                                        towerLevels.push(5.1);
                                                                                        break;
                                                                                case 13:
                                                                                        towerLevels.push(5.8);
                                                                                        break;
                                                                                case 14:
                                                                                        towerLevels.push(6.7);
                                                                                        break;
                                                                                case 15:
                                                                                        towerLevels.push(7.6);
                                                                                        break;
                                                                                case 16:
                                                                                        towerLevels.push(8.7);
                                                                                        break;
                                                                                case 17:
                                                                                        towerLevels.push(10);
                                                                                        break;
                                                                                case 18:
                                                                                        towerLevels.push(11.5);
                                                                                        break;
                                                                                case 19:
                                                                                        towerLevels.push(13.1);
                                                                                        break;
                                                                                case 20:
                                                                                        towerLevels.push(15);
                                                                                        break;
                                                                        }
                                                                }
                                                        })
                                                        if (towerCoords.length == 0) {
                                                                UI.ErrorMessage("Não há torres de vigia em nenhuma das suas aldeias!", 5000)
                                                        }
                                                },
                                        })
                                },
                        })
                }
                var doStuff = function() {
                       
                        //$.ajax({
                        //        url: url,
                        //        success: function() {
                                        intersectionPoints = [];
                                        block = [];
                                        // adiciona uma linha à tabela
                                        $("#incomings_table").find("tr").eq(timesRun).find("td").last().after("<td></td>");
                                        // pega a distância entre origem e destino
                                        var distance = Number($("#incomings_table").find("tr").eq(timesRun).find("td").eq(4).text().trim());
                                        // pega as coordenadas de origem e destino
                                        var destination = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(1).text().match(/\d+\|\d+/)[0];
                                        var origin = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(2).text().match(/\d+\|\d+/)[0];
                                        // pega o tempo de chegada e converte para segundos
                                        var hms = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(6).text().split(':'),
                                                seconds = (+hms[0]) * 3600 + (+hms[1]) * 60 + (+hms[2]),
                                                // extrai o nome do comando
                                                commandName = $("#incomings_table").find("tr").eq(timesRun).find("td").eq(0).text().trim().toLowerCase();
                                        // converte o tempo de chegada para campos
                                       
                                        //console.log(commandName);
                                        if (commandName.includes("sword") || commandName.includes("espada") || commandName.includes("espadachim")) {
                                                var remainingFields = seconds / unitSpeed[0];
                                        } else if (commandName.includes("axe") || commandName.includes("machado") || commandName.includes("bárbaro") || commandName.includes("spear") || commandName.includes("lança") || commandName.includes("lanceiro")) {
                                                var remainingFields = seconds / unitSpeed[1];
                                        } else if (commandName.includes("spy") || commandName.includes("scout") || commandName.includes("explorador") || commandName.includes("batedor")) {
                                                var remainingFields = seconds / unitSpeed[2];
                                        } else if (commandName.includes("lcav") || commandName.includes("light") || commandName.includes("cavalaria leve") || commandName.includes("arqueiro montado")) {
                                                var remainingFields = seconds / unitSpeed[3];
                                        } else if (commandName.includes("hcav") || commandName.includes("heavy") || commandName.includes("cavalaria pesada") || commandName.includes("cavaleiro")) {
                                                var remainingFields = seconds / unitSpeed[4];
                                        } else if (commandName.includes("ram") || commandName.includes("ariete") || commandName.includes("cat") || commandName.includes("catapulta")) {
                                                var remainingFields = seconds / unitSpeed[5];
                                        }else if (commandName.includes("noble") || commandName.includes("nobre") || commandName.includes("snob") || commandName.includes("paladino")) {
                                                var remainingFields = seconds / unitSpeed[6];
                                        }
                                        //console.log(remainingFields);
                                        // a inclinação da linha é m = (y1-y2) / (x1-x2), se o divisor for zero, então o divisor deve ser igual a 1
                                        var target = String(destination).split("|");
                                        var source = String(origin).split("|");
                                        var divisor = Number(target[0]) - Number(source[0]);
                                        if (divisor == 0) {
                                                divisor = 1;
                                        }
                                        var m = (Number(target[1]) - Number(source[1])) / (divisor);
                                        // onde a linha intersecta o eixo y: y1 = mx1 + b
                                        var n = (m * Number(target[0]) - Number(target[1])) / -1;
                                        for (var i = 0; i < towerCoords.length; i++) {
                                                var h = (String(towerCoords[i]).split("|"))[0];
                                                var k = (String(towerCoords[i]).split("|"))[1];
                                                var r = towerLevels[i];
                                                findCircleLineIntersections(r, h, k, m, n);
                                        }
 
                                        function findCircleLineIntersections(r, h, k, m, n) {
                                                // círculo: (x - h)^2 + (y - k)^2 = r^2
                                                // linha: y = m * x + n
                                                // r: raio do círculo
                                                // h: coordenada x do círculo
                                                // k: coordenada y do círculo
                                                // m: inclinação da linha
                                                // n: intercepto y
                                                // a, b, c são os coeficientes da equação quadrática
                                                var a = 1 + Math.pow(m, 2);
                                                var b = -h * 2 + (m * (n - k)) * 2;
                                                var c = Math.pow(h, 2) + Math.pow(n - k, 2) - Math.pow(r, 2);
                                                // valor discriminante
                                                var d = Math.pow(b, 2) - 4 * a * c;
                                                if (d >= 0) {
                                                        // fórmula quadrática
                                                        var intersections = [
                                                                (-b + Math.sqrt(d)) / 2 / a,
                                                                (-b - Math.sqrt(d)) / 2 / a
                                                        ];
                                                        if (d == 0) {
                                                                // a tangente da linha ao círculo (um ponto comum)
                                                                intersectionPoints.push((Number(intersections[0])) + "|" + (Number(m * intersections[0] + n)));
                                                        }
                                                        // a linha intersecta o contorno (dois pontos comuns)
                                                        intersectionPoints.push((Number(intersections[0])) + "|" + (Number(m * intersections[0] + n)));
                                                        intersectionPoints.push((Number(intersections[1])) + "|" + (Number(m * intersections[1] + n)));
                                                }
                                                // nada em comum
                                        }
                                        //console.log(intersectionPoints.length);
                                        // se não há ponto comum
                                        if (intersectionPoints.length == 0) {
                                                $("#incomings_table").find("tr").eq(timesRun).find("td").last().text("Indetectável").css({
                                                        "font-weight": "bold",
                                                        "color": "red"
                                                });
                                                ++timesRun
                                                setTimeout(doStuff, 1);
                                        }
                                        // interseção mais próxima da aldeia de origem no círculo
                                        for (var i = 0; i < intersectionPoints.length; i++) {
                                                var intersections = intersectionPoints[i].split("|");
                                                // para cada interseção, calcula a distância até a aldeia de origem
                                                var originDistance = Math.sqrt((Math.pow((intersections[0] - source[0]), 2) + Math.pow((intersections[1] - source[1]), 2)));
                                                block.push(originDistance);
                                        }
                                        //console.log(block);
                                        // encontra o índice da menor distância
                                        idx = block.indexOf(Math.min.apply(null, block));
                                        //console.log(idx);
                                        // com o índice obtido, que é o ponto de interseção mais próximo da aldeia de origem
                                        var nearest = intersectionPoints[idx];
                                        //console.log(nearest);
                                        // onde estamos indo, ou seja, (distância total - campo restante)
                                        var currentDistance = distance - remainingFields;
                                        // (da distância da aldeia de origem e o ponto de interseção mais próximo no círculo) subtraímos o (onde vamos)
                                        // então obtemos quantos quadrados o ataque está da interseção do círculo e então convertemos isso para segundos (multiplicamos pela velocidade da unidade)
                                        var M = nearest.split("|");
                                        var remaining = Math.sqrt((Math.pow((M[0] - source[0]), 2) + Math.pow((M[1] - source[1]), 2))) - currentDistance;
                                        //console.log(remaining);
                                        if (commandName.includes("sword") || commandName.includes("espada") || commandName.includes("espadachim")) {
                                                var sec = remaining * unitSpeed[0];
                                        } else if (commandName.includes("axe") || commandName.includes("machado") || commandName.includes("bárbaro") || commandName.includes("spear") || commandName.includes("lança") || commandName.includes("lanceiro")) {
                                                var sec = remaining * unitSpeed[1];
                                        } else if (commandName.includes("spy") || commandName.includes("scout") || commandName.includes("explorador") || commandName.includes("batedor")) {
                                                var sec = remaining * unitSpeed[2];
                                        } else if (commandName.includes("lcav") || commandName.includes("light") || commandName.includes("cavalaria leve") || commandName.includes("arqueiro montado")) {
                                                var sec = remaining * unitSpeed[3];
                                        } else if (commandName.includes("hcav") || commandName.includes("heavy") || commandName.includes("cavalaria pesada") || commandName.includes("cavaleiro")) {
                                                var sec = remaining * unitSpeed[4];
                                        } else if (commandName.includes("ram") || commandName.includes("ariete") || commandName.includes("cat") || commandName.includes("catapulta")) {
                                                var sec = remaining * unitSpeed[5];
                                        }else if (commandName.includes("noble") || commandName.includes("nobre") || commandName.includes("snob") || commandName.includes("paladino")) {
                                                var sec = remaining * unitSpeed[6];
                                        }
                                        // contagem regressiva em segundos
                                        var myTimer;
 
                                        function clock(x) {
                                                myTimer = setInterval(myClock, 1000);
 
                                                function myClock() {
                                                        --sec
                                                        var seconds = Math.floor(sec % 60);
                                                        var minutes = Math.floor((sec / 60) % 60);
                                                        var hours = Math.floor((sec / (60 * 60)));
                                                        // se o número for menor que 10, adiciona 0
                                                        seconds = seconds < 10 ? "0" + seconds : seconds;
                                                        minutes = minutes < 10 ? "0" + minutes : minutes;
                                                        hours = hours < 10 ? "0" + hours : hours;
                                                        time = hours + ":" + minutes + ":" + seconds;
                                                        // adiciona tempo à tabela
                                                        if (sec < 0) {
                                                                // se o ataque estiver dentro do alcance, o sec é negativo
                                                                var time = "Detectado";
                                                                $("#incomings_table").find("tr").eq(x).find("td").last().text(time).css({
                                                                        "font-weight": "bold",
                                                                        "color": "green"
                                                                });
                                                        } else {
                                                                var time = hours + ":" + minutes + ":" + seconds;
                                                                $("#incomings_table").find("tr").eq(x).find("td").last().text(time).css("font-weight", "bold");
                                                        }
                                                        if (sec == 0) {
                                                                clearInterval(myTimer);
                                                        }
                                                }
                                        }
                                        clock(timesRun);
                                        //console.log(towerCoords);
                                        //console.log(towerLevels);
                                        //console.log(distance);
                                        //console.log(destination);
                                        //console.log(origin);
                                        //console.log(unitSpeed);
                                        //console.log(remainingFields);
                                        //console.log(m);
                                        //console.log(n);
                                        //console.log(h);
                                        //console.log(k);
                                        //console.log(intersectionPoints);
                                        //console.log(sec);
                                        if (++timesRun < rows + 1) {
                                                doStuff();
                                        }
                                //},
                        //})
                }
                $.ajax({url: url, success: function() {
                        $.ajax({
                                url: first(),
                                success: function() {
                                        doStuff();
                                }
                        })
                        }
                });
               
        } else {
                self.location = game_data.link_base_pure.replace(/screen\=\w*/i, "screen=overview_villages&mode=incomings&subtype=attacks");
        }
void(0);
