javascript:
        if (document.URL.match("mode=incomings&subtype=attacks")) {
                $("#incomings_table").find("tr").eq(0).find("th").last().after('<th>Torre de Vigia</th>');
                var url = "https://" + location.host + game_data.link_base_pure + "overview_villages&mode=buildings&group=0&page=-1",
                        url2 = "https://" + location.host + "/interface.php?func=get_unit_info",
                        coordenadasTorres = [],
                        niveisTorres = [],
                        velocidadeUnidade = [],
                        pontosIntersecao = [],
                        bloqueio = [],
                        vezesExecutado = 1,
                        //pega o número de ataques entre parênteses no topo da tabela
                        linhas = Number($("#incomings_table").find("th").first().text().split(" ")[1].replace("(", "").replace(")", ""));
 
 
                function primeiro() {
                        $.ajax({
                                url: url2,
                                async: false,
                                success: function(data) {
                                        $.each(["sword", "axe", "spy", "light", "heavy", "ram", "snob"], function(chave, valor) {
                                                // extrai velocidades das unidades
                                                velocidadeUnidade.push(Number($(data).find("config > " + valor + " > speed").text()) * 60);
                                        })
                                        $.ajax({
                                                url: url,
                                                async: false,
                                                success: function(dados) {
                                                        $(dados).find("#villages").find("tr").each(function(chave, valor) {
                                                                if (Number($(valor).find(".upgrade_building.b_watchtower").text()) > 0) {
                                                                        // extrai coordenadas e níveis das torres de vigia
                                                                        coordenadasTorres.push($(valor).find(".quickedit-label").text().match(/\d+\|\d+/)[0]);
                                                                        // raio da torre de vigia
                                                                        var nivel = Number($(valor).find(".upgrade_building.b_watchtower").text());
                                                                        switch (nivel) {
                                                                                case 1:
                                                                                        niveisTorres.push(1.1);
                                                                                        break;
                                                                                case 2:
                                                                                        niveisTorres.push(1.3);
                                                                                        break;
                                                                                case 3:
                                                                                        niveisTorres.push(1.5);
                                                                                        break;
                                                                                case 4:
                                                                                        niveisTorres.push(1.7);
                                                                                        break;
                                                                                case 5:
                                                                                        niveisTorres.push(2);
                                                                                        break;
                                                                                case 6:
                                                                                        niveisTorres.push(2.3);
                                                                                        break;
                                                                                case 7:
                                                                                        niveisTorres.push(2.6);
                                                                                        break;
                                                                                case 8:
                                                                                        niveisTorres.push(3);
                                                                                        break;
                                                                                case 9:
                                                                                        niveisTorres.push(3.4);
                                                                                        break;
                                                                                case 10:
                                                                                        niveisTorres.push(3.9);
                                                                                        break;
                                                                                case 11:
                                                                                        niveisTorres.push(4.4);
                                                                                        break;
                                                                                case 12:
                                                                                        niveisTorres.push(5.1);
                                                                                        break;
                                                                                case 13:
                                                                                        niveisTorres.push(5.8);
                                                                                        break;
                                                                                case 14:
                                                                                        niveisTorres.push(6.7);
                                                                                        break;
                                                                                case 15:
                                                                                        niveisTorres.push(7.6);
                                                                                        break;
                                                                                case 16:
                                                                                        niveisTorres.push(8.7);
                                                                                        break;
                                                                                case 17:
                                                                                        niveisTorres.push(10);
                                                                                        break;
                                                                                case 18:
                                                                                        niveisTorres.push(11.5);
                                                                                        break;
                                                                                case 19:
                                                                                        niveisTorres.push(13.1);
                                                                                        break;
                                                                                case 20:
                                                                                        niveisTorres.push(15);
                                                                                        break;
                                                                        }
                                                                }
                                                        })
                                                        if (coordenadasTorres.length == 0) {
                                                                UI.ErrorMessage("Não há torres de vigia em nenhuma das suas aldeias!", 5000)
                                                        }
                                                },
                                        })
                                },
                        })
                }
                var fazerCoisas = function() {
                       
                        //$.ajax({
                        //        url: url,
                        //        success: function() {
                                        pontosIntersecao = [];
                                        bloqueio = [];
                                        // adiciona uma linha à tabela
                                        $("#incomings_table").find("tr").eq(vezesExecutado).find("td").last().after("<td></td>");
                                        // pega a distância entre origem e destino
                                        var distancia = Number($("#incomings_table").find("tr").eq(vezesExecutado).find("td").eq(4).text().trim());
                                        // pega as coordenadas de origem e destino
                                        var destino = $("#incomings_table").find("tr").eq(vezesExecutado).find("td").eq(1).text().match(/\d+\|\d+/)[0];
                                        var origem = $("#incomings_table").find("tr").eq(vezesExecutado).find("td").eq(2).text().match(/\d+\|\d+/)[0];
                                        // pega o tempo de chegada e converte para segundos
                                        var hms = $("#incomings_table").find("tr").eq(vezesExecutado).find("td").eq(6).text().split(':'),
                                                segundos = (+hms[0]) * 3600 + (+hms[1]) * 60 + (+hms[2]),
                                                // extrai o nome do comando
                                                nomeComando = $("#incomings_table").find("tr").eq(vezesExecutado).find("td").eq(0).text().trim().toLowerCase();
                                        // converte o tempo de chegada para campos (?)
                                       
                                        //console.log(nomeComando);
                                        if (nomeComando.includes("espada") || nomeComando.includes("sword")) {
                                                var camposRestantes = segundos / velocidadeUnidade[0];
                                        } else if (nomeComando.includes("machado") || nomeComando.includes("axe") || nomeComando.includes("lança") || nomeComando.includes("spear")) {
                                                var camposRestantes = segundos / velocidadeUnidade[1];
                                        } else if (nomeComando.includes("explorador") || nomeComando.includes("spy") || nomeComando.includes("scout")) {
                                                var camposRestantes = segundos / velocidadeUnidade[2];
                                        } else if (nomeComando.includes("cavalaria leve") || nomeComando.includes("lcav") || nomeComando.includes("light")) {
                                                var camposRestantes = segundos / velocidadeUnidade[3];
                                        } else if (nomeComando.includes("cavalaria pesada") || nomeComando.includes("hcav") || nomeComando.includes("heavy")) {
                                                var camposRestantes = segundos / velocidadeUnidade[4];
                                        } else if (nomeComando.includes("ariete") || nomeComando.includes("ram") || nomeComando.includes("catapulta") || nomeComando.includes("cat")) {
                                                var camposRestantes = segundos / velocidadeUnidade[5];
                                        }else if (nomeComando.includes("nobre") || nomeComando.includes("noble") || nomeComando.includes("snob")) {
                                                var camposRestantes = segundos / velocidadeUnidade[6];
                                        }
                                        //console.log(camposRestantes);
                                        // a inclinação da linha é m = (y1-y2) / (x1-x2), se o divisor for zero, então o divisor deve ser igual a 1
                                        var alvo = String(destino).split("|");
                                        var fonte = String(origem).split("|");
                                        var divisor = Number(alvo[0]) - Number(fonte[0]);
                                        if (divisor == 0) {
                                                divisor = 1;
                                        }
                                        var m = (Number(alvo[1]) - Number(fonte[1])) / (divisor);
                                        // onde a linha intersecta o eixo y: y1 = mx1 + b
                                        var n = (m * Number(alvo[0]) - Number(alvo[1])) / -1;
                                        for (var i = 0; i < coordenadasTorres.length; i++) {
                                                var h = (String(coordenadasTorres[i]).split("|"))[0];
                                                var k = (String(coordenadasTorres[i]).split("|"))[1];
                                                var r = niveisTorres[i];
                                                encontrarIntersecaoCirculoLinha(r, h, k, m, n);
                                        }
 
                                        function encontrarIntersecaoCirculoLinha(r, h, k, m, n) {
                                                // círculo: (x - h)^2 + (y - k)^2 = r^2
                                                // linha: y = m * x + n
                                                // r: raio do círculo
                                                // h: coordenada x do círculo
                                                // k: coordenada y do círculo
                                                // m: inclinação da linha
                                                // n: intercepto y
                                                // a, b, c são (?)
                                                var a = 1 + Math.pow(m, 2);
                                                var b = -h * 2 + (m * (n - k)) * 2;
                                                var c = Math.pow(h, 2) + Math.pow(n - k, 2) - Math.pow(r, 2);
                                                // valor discriminante (?)
                                                var d = Math.pow(b, 2) - 4 * a * c;
                                                if (d >= 0) {
                                                        // fórmula quadrática
                                                        var intersecoes = [
                                                                (-b + Math.sqrt(d)) / 2 / a,
                                                                (-b - Math.sqrt(d)) / 2 / a
                                                        ];
                                                        if (d == 0) {
                                                                // a tangente da linha ao círculo (um ponto comum) (?)
                                                                pontosIntersecao.push((Number(intersecoes[0])) + "|" + (Number(m * intersecoes[0] + n)));
                                                        }
                                                        // a linha intersecta o contorno (dois pontos comuns) (?)
                                                        pontosIntersecao.push((Number(intersecoes[0])) + "|" + (Number(m * intersecoes[0] + n)));
                                                        pontosIntersecao.push((Number(intersecoes[1])) + "|" + (Number(m * intersecoes[1] + n)));
                                                }
                                                // nada em comum (?)
                                        }
                                        //console.log(pontosIntersecao.length);
                                        // se não há ponto comum
                                        if (pontosIntersecao.length == 0) {
                                                $("#incomings_table").find("tr").eq(vezesExecutado).find("td").last().text("Indetectável").css({
                                                        "font-weight": "bold",
                                                        "color": "red"
                                                });
                                                ++vezesExecutado
                                                setTimeout(fazerCoisas, 1);
                                        }
                                        // interseção mais próxima da aldeia de origem no círculo
                                        for (var i = 0; i < pontosIntersecao.length; i++) {
                                                var intersecoes = pontosIntersecao[i].split("|");
                                                // para cada interseção, calcula a distância até a aldeia de origem
                                                var distanciaOrigem = Math.sqrt((Math.pow((intersecoes[0] - fonte[0]), 2) + Math.pow((intersecoes[1] - fonte[1]), 2)));
                                                bloqueio.push(distanciaOrigem);
                                        }
                                        //console.log(bloqueio);
                                        // encontra o índice da menor distância
                                        idx = bloqueio.indexOf(Math.min.apply(null, bloqueio));
                                        //console.log(idx);
                                        // com o índice obtido, que é o ponto de interseção mais próximo da aldeia de origem (?)
                                        var maisPróximo = pontosIntersecao[idx];
                                        //console.log(maisPróximo);
                                        // onde estamos indo, ou seja, (distância total - campo restante)
                                        var distanciaAtual = distancia - camposRestantes;
                                        // (da distância da aldeia de origem e o ponto de interseção mais próximo no círculo) subtraímos o (onde vamos) (?)
                                        // então obtemos quantos quadrados o ataque está da interseção do círculo e então convertemos isso para segundos (multiplicamos pela velocidade da unidade)
                                        var M = maisPróximo.split("|");
                                        var restante = Math.sqrt((Math.pow((M[0] - fonte[0]), 2) + Math.pow((M[1] - fonte[1]), 2))) - distanciaAtual;
                                        //console.log(restante);
                                        if (nomeComando.includes("espada") || nomeComando.includes("sword")) {
                                                var seg = restante * velocidadeUnidade[0];
                                        } else if (nomeComando.includes("machado") || nomeComando.includes("axe") || nomeComando.includes("lança") || nomeComando.includes("spear")) {
                                                var seg = restante * velocidadeUnidade[1];
                                        } else if (nomeComando.includes("explorador") || nomeComando.includes("spy") || nomeComando.includes("scout")) {
                                                var seg = restante * velocidadeUnidade[2];
                                        } else if (nomeComando.includes("cavalaria leve") || nomeComando.includes("lcav") || nomeComando.includes("light")) {
                                                var seg = restante * velocidadeUnidade[3];
                                        } else if (nomeComando.includes("cavalaria pesada") || nomeComando.includes("hcav") || nomeComando.includes("heavy")) {
                                                var seg = restante * velocidadeUnidade[4];
                                        } else if (nomeComando.includes("ariete") || nomeComando.includes("ram") || nomeComando.includes("catapulta") || nomeComando.includes("cat")) {
                                                var seg = restante * velocidadeUnidade[5];
                                        }else if (nomeComando.includes("nobre") || nomeComando.includes("noble") || nomeComando.includes("snob")) {
                                                var seg = restante * velocidadeUnidade[6];
                                        }
                                        // contagem regressiva em segundos
                                        var meuTimer;
 
                                        function relogio(x) {
                                                meuTimer = setInterval(meuRelogio, 1000);
 
                                                function meuRelogio() {
                                                        --seg
                                                        var segundos = Math.floor(seg % 60);
                                                        var minutos = Math.floor((seg / 60) % 60);
                                                        var horas = Math.floor((seg / (60 * 60)));
                                                        // se o número for menor que 10, adiciona 0
                                                        segundos = segundos < 10 ? "0" + segundos : segundos;
                                                        minutos = minutos < 10 ? "0" + minutos : minutos;
                                                        horas = horas < 10 ? "0" + horas : horas;
                                                        tempo = horas + ":" + minutos + ":" + segundos;
                                                        // adiciona tempo à tabela
                                                        if (seg < 0) {
                                                                // se o ataque estiver dentro do alcance, o seg é negativo
                                                                var tempo = "Detectado";
                                                                $("#incomings_table").find("tr").eq(x).find("td").last().text(tempo).css({
                                                                        "font-weight": "bold",
                                                                        "color": "green"
                                                                });
                                                        } else {
                                                                var tempo = horas + ":" + minutos + ":" + segundos;
                                                                $("#incomings_table").find("tr").eq(x).find("td").last().text(tempo).css("font-weight", "bold");
                                                        }
                                                        if (seg == 0) {
                                                                clearInterval(meuTimer);
                                                        }
                                                }
                                        }
                                        relogio(vezesExecutado);
                                        //console.log(coordenadasTorres);
                                        //console.log(niveistorres);
                                        //console.log(distancia);
                                        //console.log(destino);
                                        //console.log(origem);
                                        //console.log(velocidadeUnidade);
                                        //console.log(camposRestantes);
                                        //console.log(m);
                                        //console.log(n);
                                        //console.log(h);
                                        //console.log(k);
                                        //console.log(pontosIntersecao);
                                        //console.log(seg);
                                        if (++vezesExecutado < linhas + 1) {
                                                fazerCoisas();
                                        }
                                //},
                        //})
                }
                $.ajax({url: url, success: function() {
                        $.ajax({
                                url: primeiro(),
                                success: function() {
                                        fazerCoisas();
                                }
                        })
                        }
                });
               
        } else {
                self.location = game_data.link_base_pure.replace(/screen\=\w*/i, "screen=overview_villages&mode=incomings&subtype=attacks");
        }
void(0);
