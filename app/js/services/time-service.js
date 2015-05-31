app.service("TimeUtils", function(){
    return new (function(){

        var that = this;
        /*
         * Utility functions to handle time and dates
         */
        this.parseHour = function(string){
            var m = /^(\d{1,2}):(\d{1,2})$/.exec(string);
            if(m === null || m[1] < 0 || m[1] > 24 || m[2] < 0 || m[2] > 60){
                throw 'invalid hour format';
            }
            return m[1]*60 + m[2]*1;
        }
        this.getHourFromInt = function(int){
            var minutes = int % 60;
            var hour = (int-minutes)/60;
            return (hour<10?'0':'')+hour+':'+(minutes<10?'0':'')+minutes;
        }

        /**
         * US format
         * @param d, a Date object for the target time
         * @returns {string}, the corresponding "SQL formated" date
         */
        this.getDateSQL = function(d){
            var day = d.getDate();
            var month = d.getMonth()+1;
            return d.getFullYear()+'-'+(month<10?'0':'')+month+'-'+(day<10?'0':'')+day
        }

        /**
         * To be displayed to the user, not valid to be stored in the database - sent to back to the server
         * @param usFormat
         * @returns {string}
         */
        this.toEuFormat = function(usFormat){
            var date = new Date(usFormat);
            if(isNaN(date.getTime())){
                return "?"
            }
            var day = date.getDate();
            var month = date.getMonth()+1;
            return (day<10?'0':'')+day+'/'+(month<10?'0':'')+month+'/'+date.getFullYear();
        }

        var minuteStep = 15;
        this.computeRange = function(appointment){
            var min = Number.MAX_VALUE;
            var max = Number.MIN_VALUE;
            appointment.slot_list.forEach(function (item) {
                var time = that.parseHour(item.start);
                min = (time < min ? time : min);
                max = (time > max ? time : max);
            });
            //we deal with start times
            max += minuteStep;
            return {
                min:min,
                max:max,
                start:that.getHourFromInt(min),
                end:that.getHourFromInt(max)
            };
        };

    })()
})