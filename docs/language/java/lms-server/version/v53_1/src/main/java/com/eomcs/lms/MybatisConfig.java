package com.eomcs.lms;

import javax.sql.DataSource;
import org.apache.ibatis.logging.LogFactory;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Spring IoC 컨테이너가 이 클래스를 Java Config로 자동 인식하게 하려면
// 다음 애노테이션을 붙여야 한다.
// 단, 이 클래스가 @ComponentScan에서 지정한 패키지 안에 있어야 한다.
@Configuration
// Mybatis Dao 프록시를 자동생성 할 인터페이스를 지정한다.
@MapperScan("com.eomcs.lms.dao")
public class MybatisConfig {

  static Logger logger = LogManager.getLogger(MybatisConfig.class);

  public MybatisConfig() {
    logger.debug("MybatisConfig 객체 생성");
  }

  // Spring IoC 컨테이너에 수동으로 등록할 객체를 등록하고 싶다면
  // 그 객체를 만들어주는 팩토리 메서드를 정의해야 한다.
  // 단, 메서드 선언부에 @Bean 애노테이션을 붙여야 한다.
  // 그래야만 Spring IoC 컨테이너가 메서드를 호출하고 그 리턴 값을 보관한다.


  @Bean
  public SqlSessionFactory sqlSessionFactory(DataSource dataSource, // DB커넥션풀
      ApplicationContext appCtx/* Spring IoC 컨테이너 */) throws Exception {

    // Mybatis의 log4j 활성화시키기
    LogFactory.useLog4JLogging();

    // Spring IoC 컨테이너 용으로 mybatis에서 따로 제작한
    // SqlSessionFactory이다.
    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
    sqlSessionFactoryBean.setDataSource(dataSource);
    sqlSessionFactoryBean.setTypeAliasesPackage("com.eomcs.lms.domain");
    // Spring IoC 컨테이너를 통해 SQL 맵퍼 파일의 위치 정보를 가져온다.
    sqlSessionFactoryBean
        .setMapperLocations(appCtx.getResources("classpath:com/eomcs/lms/mapper/*Mapper.xml"));
    return sqlSessionFactoryBean.getObject();
  }

}
