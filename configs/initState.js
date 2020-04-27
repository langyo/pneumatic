export default {
  initializing: true,
  $page: 'overview',

  tasks: {
    'MCBBS': {
      status: 'sleep',
      fetch: [
        {
          title: '主页',
          rule: {
            type: 'static',
            href: 'https://www.mcbbs.net/forum.php'
          },
          interval: {
            min: 30
          },
          parseCode: '() => ({ degree: +$("#category_50 > table > tbody > tr:nth-child(1) > td:nth-child(2) > h2 > em").innerText, time: (new Date()).toLocaleTimeString() })'
        }
      ],
      parse: [
        {
          title: '茶馆活跃度感知',
          type: 'line-chart',
          sourceTable: 'forumTable',
          rules: {
            xAxis: 'time',
            yAxis: 'degree'
          }
        }
      ],
      data: {
        'forumTable': [
          {
            time: '06:00',
            degree: 2023
          }, {
            time: '06:30',
            degree: 2087
          }, {
            time: '07:00',
            degree: 1970
          }, {
            time: '07:30',
            degree: 1543
          }, {
            time: '08:00',
            degree: 1992
          }
        ]
      }
    }
  },
  account: {}
};